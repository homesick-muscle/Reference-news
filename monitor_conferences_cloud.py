import argparse
import concurrent.futures
import hashlib
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "conferences.json"
STATE_PATH = ROOT / "state.json"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/138.0.0.0 Safari/537.36"
)

KEYWORDS = [
    "registration",
    "register",
    "pricing",
    "price",
    "ticket",
    "venue",
    "hotel",
    "visa",
    "date",
    "deadline",
    "attend",
    "报名",
    "注册",
    "票",
    "票价",
    "地点",
    "酒店",
    "签证",
    "截止",
    "时间",
]


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def strip_html(raw_html: str) -> str:
    text = re.sub(r"(?is)<script.*?>.*?</script>", " ", raw_html)
    text = re.sub(r"(?is)<style.*?>.*?</style>", " ", text)
    text = re.sub(r"(?i)<br\\s*/?>", "\n", text)
    text = re.sub(r"(?i)</p>", "\n", text)
    text = re.sub(r"(?i)</div>", "\n", text)
    text = re.sub(r"(?i)</li>", "\n", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text


def normalize_lines(text: str) -> list[str]:
    lines = []
    for line in text.splitlines():
        clean = re.sub(r"\s+", " ", line).strip()
        if clean:
            lines.append(clean)
    return lines


def extract_relevant_lines(lines: list[str], extra_keywords: list[str] | None = None) -> list[str]:
    keywords = KEYWORDS + (extra_keywords or [])
    lower_keywords = [item.lower() for item in keywords]
    indices: set[int] = set()
    for index, line in enumerate(lines):
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in lower_keywords):
            for offset in (-1, 0, 1):
                neighbor = index + offset
                if 0 <= neighbor < len(lines):
                    indices.add(neighbor)

    if not indices:
        return lines[:120]

    return [lines[index] for index in sorted(indices)]


def fetch_page(url: str, keywords: list[str] | None = None) -> dict[str, str]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        },
        method="GET",
    )

    with urllib.request.urlopen(request, timeout=12) as response:
        content_type = response.headers.get("Content-Type", "")
        body = response.read()
        final_url = response.geturl()

    text = body.decode("utf-8", errors="replace")
    if "html" in content_type.lower():
        text = strip_html(text)

    lines = normalize_lines(text)
    relevant_lines = extract_relevant_lines(lines, keywords)
    relevant_text = "\n".join(relevant_lines)
    hash_value = hashlib.sha256(relevant_text.encode("utf-8")).hexdigest()

    return {
        "hash": hash_value,
        "relevant_text": relevant_text[:6000],
        "line_count": str(len(lines)),
        "final_url": final_url,
        "content_type": content_type,
    }


def parse_date(date_text: str | None) -> datetime | None:
    if not date_text:
        return None
    try:
        return datetime.strptime(date_text, "%Y-%m-%d")
    except ValueError:
        return None


def display_value(conference: dict[str, Any], key: str, fallback: str = "待公布") -> str:
    display_keys = [f"{key}_display"]
    if key == "registration_open_date":
        display_keys.append("registration_open_display")
    elif key == "meeting_start_date":
        display_keys.append("meeting_start_display")

    for display_key in display_keys:
        if conference.get(display_key):
            return str(conference[display_key])
    if conference.get(key):
        return str(conference[key])
    return fallback


def derive_status(conference: dict[str, Any], today: datetime) -> tuple[str, str]:
    reg_open = parse_date(conference.get("registration_open_date"))
    reg_deadline = parse_date(conference.get("registration_deadline"))
    meeting_start = parse_date(conference.get("meeting_start_date"))
    meeting_end = parse_date(conference.get("meeting_end_date"))

    if reg_deadline and today.date() > reg_deadline.date():
        status = "已截止"
    elif meeting_end and today.date() > meeting_end.date():
        status = "已截止"
    elif reg_open and today.date() < reg_open.date():
        status = "未开放"
    elif reg_deadline and 0 <= (reg_deadline.date() - today.date()).days <= 14:
        status = "即将截止"
    elif reg_open and today.date() >= reg_open.date():
        status = "已开放"
    elif display_value(conference, "registration_open_date") == "已开放":
        status = "已开放"
    else:
        status = "未开放"

    action = "继续观望"
    if status in {"已开放", "即将截止"}:
        action = "现在去注册"
    elif meeting_start and 0 <= (meeting_start.date() - today.date()).days <= 120:
        action = "先订酒店"

    return status, action


def build_event(conference: dict[str, Any], page_labels: list[str], reason: str, now_local: datetime) -> dict[str, str]:
    status, action = derive_status(conference, now_local)
    page_text = "、".join(page_labels) if page_labels else "监测页"
    return {
        "会议": conference["name"],
        "地点": conference.get("venue_display", "待公布"),
        "票价": conference.get("price_display", "待公布"),
        "报名开始时间": display_value(conference, "registration_open_date"),
        "会议开始时间": display_value(conference, "meeting_start_date"),
        "当前状态": status,
        "建议动作": action,
        "更新日期": now_local.strftime("%Y-%m-%d"),
        "变化内容": f"{reason}（{page_text}）",
        "官方链接": conference["main_url"],
        "截止日期详情": conference.get("deadline_display", "待公布"),
    }


def is_within_last_30_days(target: datetime | None, today: datetime) -> bool:
    if target is None:
        return False
    delta_days = (today.date() - target.date()).days
    return 0 <= delta_days <= 30


def build_repeat_event(conference: dict[str, Any], now_local: datetime) -> dict[str, str] | None:
    status, action = derive_status(conference, now_local)
    reg_open = parse_date(conference.get("registration_open_date"))
    meeting_start = parse_date(conference.get("meeting_start_date"))
    meeting_end = parse_date(conference.get("meeting_end_date"))

    ongoing = False
    if meeting_start and meeting_end:
        ongoing = meeting_start.date() <= now_local.date() <= meeting_end.date()

    recently_opened = is_within_last_30_days(reg_open, now_local)
    recently_started = is_within_last_30_days(meeting_start, now_local)
    registration_active = status in {"已开放", "即将截止"}

    if not (ongoing or recently_opened or recently_started or registration_active):
        return None

    reason = "近一个月内仍需关注（报名中或会议进行中）"
    if ongoing:
        reason = "会议正在进行中"
    elif status == "即将截止":
        reason = "报名即将截止"
    elif registration_active:
        reason = "报名仍在开放中"

    return {
        "会议": conference["name"],
        "地点": conference.get("venue_display", "待公布"),
        "票价": conference.get("price_display", "待公布"),
        "报名开始时间": display_value(conference, "registration_open_date"),
        "会议开始时间": display_value(conference, "meeting_start_date"),
        "当前状态": status,
        "建议动作": action,
        "更新日期": now_local.strftime("%Y-%m-%d"),
        "变化内容": reason,
        "官方链接": conference["main_url"],
        "截止日期详情": conference.get("deadline_display", "待公布"),
    }


def compose_message(events: list[dict[str, str]], now_local: datetime, prefix: str) -> str:
    header = f"{prefix}【AI顶会追踪｜{now_local.strftime('%Y-%m-%d %H:%M')}】"
    lines = [header]
    for event in events:
        lines.append(f"- 会议：{event['会议']}")
        lines.append(f"  地点：{event['地点']}")
        lines.append(f"  票价：{event['票价']}")
        lines.append(f"  报名开始时间：{event['报名开始时间']}")
        lines.append(f"  会议开始时间：{event['会议开始时间']}")
        lines.append(f"  当前状态：{event['当前状态']}")
        lines.append(f"  建议动作：{event['建议动作']}")
        lines.append(f"  变化内容：{event['变化内容']}")
        lines.append(f"  官方链接：{event['官方链接']}")
        lines.append(f"  截止日期详情：{event['截止日期详情']}")
    return "\n".join(lines)


def send_feishu(webhook: str, text: str) -> str:
    payload = json.dumps(
        {
            "msg_type": "text",
            "content": {
                "text": text,
            },
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        webhook,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode("utf-8", errors="replace")


def compact_state_entry(conference_name: str, label: str, url: str, fetched: dict[str, str], error: str | None) -> dict[str, str | None]:
    return {
        "conference": conference_name,
        "label": label,
        "url": url,
        "hash": fetched.get("hash") if fetched else None,
        "relevant_text": fetched.get("relevant_text") if fetched else None,
        "final_url": fetched.get("final_url") if fetched else None,
        "content_type": fetched.get("content_type") if fetched else None,
        "last_error": error,
    }


def monitor(dry_run: bool, bootstrap: bool) -> int:
    config = load_json(CONFIG_PATH, {})
    state = load_json(STATE_PATH, {"pages": {}})
    pages_state = state.setdefault("pages", {})

    timezone = ZoneInfo(config.get("timezone", "Asia/Shanghai"))
    now_local = datetime.now(timezone)
    conferences = config.get("conferences", [])
    conference_map = {conference["name"]: conference for conference in conferences}
    conference_results: dict[str, dict[str, list[str]]] = {
        conference["name"]: {"changed": [], "failed": []}
        for conference in conferences
    }

    page_jobs: list[tuple[dict[str, Any], dict[str, Any]]] = []
    for conference in conferences:
        for page in conference.get("monitor_pages", []):
            page_jobs.append((conference, page))

    previous_empty = not pages_state

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        future_map = {
            executor.submit(fetch_page, page["url"], page.get("keywords")): (conference, page)
            for conference, page in page_jobs
        }
        for future in concurrent.futures.as_completed(future_map):
            conference, page = future_map[future]
            url = page["url"]
            label = page["label"]
            previous = pages_state.get(url, {})

            try:
                fetched = future.result()
                current = compact_state_entry(conference["name"], label, url, fetched, None)
                if previous and previous.get("hash") != fetched["hash"]:
                    conference_results[conference["name"]]["changed"].append(label)
                elif previous and previous.get("last_error"):
                    conference_results[conference["name"]]["changed"].append(label)
                pages_state[url] = current
            except Exception as exc:  # noqa: BLE001
                error_text = str(exc)
                current = compact_state_entry(conference["name"], label, url, previous, error_text)
                if previous.get("last_error") != error_text:
                    conference_results[conference["name"]]["failed"].append(label)
                pages_state[url] = current

    save_json(STATE_PATH, state)

    if previous_empty or bootstrap:
        print("baseline initialized")
        return 0

    events: list[dict[str, str]] = []
    for conference_name, result in conference_results.items():
        conference = conference_map[conference_name]
        if result["changed"]:
            events.append(build_event(conference, result["changed"], "检测到官方页面内容变化", now_local))

    failed_pages = {
        conference_name: result["failed"]
        for conference_name, result in conference_results.items()
        if result["failed"]
    }
    if failed_pages:
        for conference_name, labels in failed_pages.items():
            print(f"[warn] 页面访问异常已忽略，不发送提醒: {conference_name} -> {', '.join(labels)}", file=sys.stderr)

    prefix = "【新资讯】"
    if not events:
        repeat_events = []
        for conference in conferences:
            event = build_repeat_event(conference, now_local)
            if event is not None:
                repeat_events.append(event)

        if not repeat_events:
            print("无重要更新")
            return 0

        events = repeat_events
        prefix = "【未更新】"

    message = compose_message(events, now_local, prefix)
    if dry_run:
        print(message)
        return 0

    webhook = os.environ.get("FEISHU_WEBHOOK_URL", "").strip()
    if not webhook:
        print("FEISHU_WEBHOOK_URL is not set", file=sys.stderr)
        return 2

    try:
        response = send_feishu(webhook, message)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        print(f"HTTP {exc.code}: {detail}", file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        print(f"request failed: {exc}", file=sys.stderr)
        return 1

    print(response)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="GitHub Actions monitor for official conference pages.")
    parser.add_argument("--dry-run", action="store_true", help="Print reminder without sending to Feishu.")
    parser.add_argument("--bootstrap", action="store_true", help="Initialize baseline state without alerts.")
    args = parser.parse_args()
    return monitor(dry_run=args.dry_run, bootstrap=args.bootstrap)


if __name__ == "__main__":
    raise SystemExit(main())
