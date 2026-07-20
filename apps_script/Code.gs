var TIMEZONE = 'Asia/Shanghai';
var FEISHU_PROPERTY = 'FEISHU_WEBHOOK_URL';
var STATE_PROPERTY = 'CONFERENCE_ALERT_STATE';

var KEYWORDS = [
  'registration',
  'register',
  'pricing',
  'price',
  'ticket',
  'venue',
  'hotel',
  'visa',
  'date',
  'deadline',
  'attend',
  '报名',
  '注册',
  '票',
  '票价',
  '地点',
  '酒店',
  '签证',
  '截止',
  '时间'
];

var CONFERENCES = [
  {
    name: 'WAIC 2026',
    mainUrl: 'https://www.worldaic.com.cn/',
    monitorPages: [
      { label: '官网首页', url: 'https://www.worldaic.com.cn/' },
      { label: '报名页', url: 'https://www.worldaic.com.cn/register' }
    ],
    venueDisplay: '中国上海',
    priceDisplay: '待核实',
    registrationOpenDate: null,
    registrationOpenDisplay: '已开放',
    meetingStartDate: '2026-07-17',
    meetingStartDisplay: '2026-07-17',
    meetingEndDate: '2026-07-20',
    deadlineDisplay: '以官网最新安排为准'
  },
  {
    name: 'WAICA 2026',
    mainUrl: 'https://waica2026.worldaic.com.cn/',
    monitorPages: [
      { label: '官网首页', url: 'https://waica2026.worldaic.com.cn/' },
      { label: '注册页', url: 'https://waica2026.worldaic.com.cn/registration/' },
      { label: '参会指南', url: 'https://waica2026.worldaic.com.cn/participant-guide/' }
    ],
    venueDisplay: '中国上海',
    priceDisplay: '普通代表 ¥4000；学生 ¥2000；Workshop Pass ¥2500',
    registrationOpenDate: null,
    registrationOpenDisplay: '已开放',
    meetingStartDate: '2026-07-18',
    meetingStartDisplay: '2026-07-18',
    meetingEndDate: '2026-07-20',
    deadlineDisplay: '以官网最新安排为准'
  },
  {
    name: 'NeurIPS 2026',
    mainUrl: 'https://neurips.cc/Conferences/2026',
    monitorPages: [
      { label: '会议主页', url: 'https://neurips.cc/Conferences/2026' },
      { label: '日期页', url: 'https://neurips.cc/Conferences/2026/Dates' },
      { label: '注册页', url: 'https://nips.cc/Register/view-registration' }
    ],
    venueDisplay: '澳大利亚悉尼；卫星点：巴黎、亚特兰大',
    priceDisplay: '待公布',
    registrationOpenDate: '2026-07-20',
    registrationOpenDisplay: '2026-07-20',
    meetingStartDate: '2026-12-06',
    meetingStartDisplay: '2026-12-06',
    meetingEndDate: '2026-12-12',
    deadlineDisplay: '以官网最新安排为准'
  },
  {
    name: 'KDD 2026',
    mainUrl: 'https://kdd2026.kdd.org/',
    monitorPages: [
      { label: '会议主页', url: 'https://kdd2026.kdd.org/' },
      { label: '注册页', url: 'https://kdd2026.kdd.org/registration/' }
    ],
    venueDisplay: '韩国济州 ICC Jeju',
    priceDisplay: '学生 USD 600；会员 USD 1250；非会员 USD 1500；单日票 USD 600',
    registrationOpenDate: null,
    registrationOpenDisplay: '已开放',
    meetingStartDate: '2026-08-09',
    meetingStartDisplay: '2026-08-09',
    meetingEndDate: '2026-08-13',
    registrationDeadline: '2026-08-08',
    deadlineDisplay: 'Standard 截止 2026-08-08'
  },
  {
    name: 'AAAI-27',
    mainUrl: 'https://aaai.org/conference/aaai/aaai-27/',
    monitorPages: [
      { label: '会议主页', url: 'https://aaai.org/conference/aaai/aaai-27/' }
    ],
    venueDisplay: '加拿大蒙特利尔',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: '2027-02-16',
    meetingStartDisplay: '2027-02-16',
    meetingEndDate: '2027-02-23',
    deadlineDisplay: '待公布'
  },
  {
    name: 'ICML 2027',
    mainUrl: 'https://icml.cc/Conferences/FutureMeetings',
    monitorPages: [
      { label: 'Future Meetings', url: 'https://icml.cc/Conferences/FutureMeetings' }
    ],
    venueDisplay: '待公布',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: null,
    meetingStartDisplay: '待公布（官方称 2027 年 8 月公告）',
    meetingEndDate: null,
    deadlineDisplay: '待公布'
  },
  {
    name: 'ICDM 2026',
    mainUrl: 'https://icdm2026.neu.edu.cn/',
    monitorPages: [
      { label: '会议主页', url: 'https://icdm2026.neu.edu.cn/' },
      { label: '参会页', url: 'https://icdm2026.neu.edu.cn/11683/list.htm' }
    ],
    venueDisplay: '中国沈阳',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: '2026-11-12',
    meetingStartDisplay: '2026-11-12',
    meetingEndDate: '2026-11-15',
    deadlineDisplay: '待公布'
  },
  {
    name: 'CVPR 2027',
    mainUrl: 'https://cvpr.thecvf.com/',
    monitorPages: [
      { label: 'CVF Future Meetings', url: 'https://www.thecvf.com/?page_id=100' },
      { label: 'CVPR 站点', url: 'https://cvpr.thecvf.com/' }
    ],
    venueDisplay: '美国西雅图 Seattle Convention Center',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: '2027-06-20',
    meetingStartDisplay: '2027-06-20',
    meetingEndDate: '2027-06-24',
    deadlineDisplay: '待公布'
  },
  {
    name: 'ICCV 2027',
    mainUrl: 'https://iccv.thecvf.com/',
    monitorPages: [
      { label: 'CVF Future Meetings', url: 'https://www.thecvf.com/?page_id=100' },
      { label: 'ICCV 站点', url: 'https://iccv.thecvf.com/' }
    ],
    venueDisplay: '中国香港',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: '2027-10-02',
    meetingStartDisplay: '2027-10-02',
    meetingEndDate: '2027-10-08',
    deadlineDisplay: '待公布'
  },
  {
    name: 'ECCV 2026',
    mainUrl: 'https://eccv.ecva.net/',
    monitorPages: [
      { label: '会议主页', url: 'https://eccv.ecva.net/' },
      { label: '日期页', url: 'https://eccv.ecva.net/Conferences/2026/Dates' },
      { label: '注册页', url: 'https://eccv.ecva.net/Conferences/2026/Registration' }
    ],
    venueDisplay: '瑞典马尔默 Malmö Arena and Malmömässan',
    priceDisplay: '待公布',
    registrationOpenDate: '2026-06-17',
    registrationOpenDisplay: '2026-06-17',
    meetingStartDate: '2026-09-08',
    meetingStartDisplay: '2026-09-08',
    meetingEndDate: '2026-09-12',
    deadlineDisplay: '待公布'
  },
  {
    name: 'ICLR 2027',
    mainUrl: 'https://iclr.cc/Conferences/FutureMeetings',
    monitorPages: [
      { label: 'Future Meetings', url: 'https://iclr.cc/Conferences/FutureMeetings' }
    ],
    venueDisplay: '北美西海岸',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: null,
    meetingStartDisplay: '待公布',
    meetingEndDate: null,
    deadlineDisplay: '待公布'
  },
  {
    name: 'WWW 2027',
    mainUrl: 'https://thewebconf.org/',
    monitorPages: [
      { label: '会议主页', url: 'https://thewebconf.org/' }
    ],
    venueDisplay: '爱尔兰都柏林',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: null,
    meetingStartDisplay: '待公布',
    meetingEndDate: null,
    deadlineDisplay: '待公布'
  },
  {
    name: 'SIGIR 2027',
    mainUrl: 'https://sigir.org/',
    monitorPages: [
      { label: '学会主页', url: 'https://sigir.org/' }
    ],
    venueDisplay: '美国硅谷',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: null,
    meetingStartDisplay: '待公布',
    meetingEndDate: null,
    deadlineDisplay: '待公布'
  },
  {
    name: 'CIKM 2026',
    mainUrl: 'https://cikm2026.diag.uniroma1.it/',
    monitorPages: [
      { label: '会议主页', url: 'https://cikm2026.diag.uniroma1.it/' },
      { label: '注册页', url: 'https://cikm2026.diag.uniroma1.it/registration/' }
    ],
    venueDisplay: '意大利罗马',
    priceDisplay: '待公布',
    registrationOpenDate: null,
    registrationOpenDisplay: '待公布',
    meetingStartDate: '2026-11-07',
    meetingStartDisplay: '2026-11-07',
    meetingEndDate: '2026-11-11',
    deadlineDisplay: '待公布'
  }
];

function setup() {
  removeTriggers_();
  createDailyTrigger_('runMonitor', getScheduleHour_('MORNING_TRIGGER_HOUR', 10), getScheduleMinute_('MORNING_TRIGGER_MINUTE', 30));
  createDailyTrigger_('runMonitor', getScheduleHour_('EVENING_TRIGGER_HOUR', 19), getScheduleMinute_('EVENING_TRIGGER_MINUTE', 7));
  if (!loadState_()) {
    saveState_({ pages: {} });
  }
}

function setupMinuteTest() {
  removeTriggers_();
  ScriptApp.newTrigger('runMonitor').timeBased().everyMinutes(1).create();
  if (!loadState_()) {
    saveState_({ pages: {} });
  }
}

function createDailyTrigger_(handler, hour, minute) {
  ScriptApp.newTrigger(handler).timeBased().atHour(hour).nearMinute(minute).everyDays(1).inTimezone(TIMEZONE).create();
}

function getScheduleHour_(propertyName, fallback) {
  var value = PropertiesService.getScriptProperties().getProperty(propertyName);
  var parsed = value ? parseInt(value, 10) : fallback;
  return isNaN(parsed) ? fallback : parsed;
}

function getScheduleMinute_(propertyName, fallback) {
  var value = PropertiesService.getScriptProperties().getProperty(propertyName);
  var parsed = value ? parseInt(value, 10) : fallback;
  return isNaN(parsed) ? fallback : parsed;
}

function removeTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function bootstrap() {
  saveState_({ pages: {} });
  return 'baseline initialized';
}

function runMonitor() {
  return monitor_(false);
}

function runDry() {
  return monitor_(true);
}

function sendTest() {
  var webhook = getWebhook_();
  var now = formatNow_();
  var text = '【AI顶会追踪｜测试】\nGoogle Apps Script 已接通。\n当前时间：' + now;
  var response = sendFeishu_(webhook, text);
  Logger.log(response);
  return response;
}

function monitor_(dryRun) {
  var state = loadState_() || { pages: {} };
  if (!state.pages) {
    state.pages = {};
  }
  var oldPages = state.pages;
  var newPages = {};
  var timezone = TIMEZONE;
  var now = new Date();
  var nowText = formatDate_(now, timezone, 'yyyy-MM-dd HH:mm:ss');
  var todayKey = formatDate_(now, timezone, 'yyyy-MM-dd');

  var conferenceResults = {};
  var conferenceMap = {};
  for (var i = 0; i < CONFERENCES.length; i++) {
    conferenceResults[CONFERENCES[i].name] = { changed: [], failed: [] };
    conferenceMap[CONFERENCES[i].name] = CONFERENCES[i];
  }

  for (var c = 0; c < CONFERENCES.length; c++) {
    var conf = CONFERENCES[c];
    for (var p = 0; p < conf.monitorPages.length; p++) {
      var page = conf.monitorPages[p];
      var previous = oldPages[page.url] || {};
      try {
        var fetched = fetchPage_(page.url, page.keywords);
        newPages[page.url] = makeStateEntry_(conf.name, page.label, page.url, fetched, null);
        if (previous && previous.hash && previous.hash !== fetched.hash) {
          conferenceResults[conf.name].changed.push(page.label);
        } else if (previous && previous.lastError) {
          conferenceResults[conf.name].changed.push(page.label);
        }
      } catch (err) {
        newPages[page.url] = makeStateEntry_(conf.name, page.label, page.url, previous, String(err));
        if (!previous.lastError || String(previous.lastError) !== String(err)) {
          conferenceResults[conf.name].failed.push(page.label);
        }
      }
    }
  }

  state.pages = newPages;
  saveState_(state);

  if (isStateEmpty_(oldPages)) {
    Logger.log('baseline initialized');
    return 'baseline initialized';
  }

  var events = [];
  for (var name in conferenceResults) {
    if (!conferenceResults.hasOwnProperty(name)) continue;
    var result = conferenceResults[name];
    var confObj = conferenceMap[name];
    if (result.changed.length) {
      events.push(buildEvent_(confObj, result.changed, '检测到官方页面内容变化', now));
    }
    if (result.failed.length) {
      Logger.log('ignored page access errors for ' + name + ': ' + result.failed.join(', '));
    }
  }

  var prefix = '【新资讯】';
  if (!events.length) {
    var repeatEvents = [];
    for (var k = 0; k < CONFERENCES.length; k++) {
      var repeat = buildRepeatEvent_(CONFERENCES[k], now);
      if (repeat) repeatEvents.push(repeat);
    }
    if (!repeatEvents.length) {
      Logger.log('无重要更新');
      return '无重要更新';
    }
    events = repeatEvents;
    prefix = '【未更新】';
  }

  var message = composeMessage_(events, prefix, now);
  if (dryRun) {
    Logger.log(message);
    return message;
  }

  var response = sendFeishu_(getWebhook_(), message);
  Logger.log(response);
  return response;
}

function fetchPage_(url, keywords) {
  var response = UrlFetchApp.fetch(url, {
    followRedirects: true,
    muteHttpExceptions: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });

  var code = response.getResponseCode();
  if (code >= 400) {
    throw new Error('HTTP ' + code);
  }

  var contentType = String(response.getHeaders()['Content-Type'] || '');
  var text = response.getContentText();
  if (contentType.toLowerCase().indexOf('html') !== -1) {
    text = stripHtml_(text);
  }

  var lines = normalizeLines_(text);
  var relevantLines = extractRelevantLines_(lines, keywords);
  var relevantText = relevantLines.join('\n');
  var hash = sha256_(relevantText);
  return {
    hash: hash,
    relevantText: relevantText.slice(0, 6000),
    lineCount: String(lines.length),
    finalUrl: response.getFinalUrl ? response.getFinalUrl() : url,
    contentType: contentType
  };
}

function makeStateEntry_(conferenceName, label, url, fetched, errorText) {
  fetched = fetched || {};
  return {
    conference: conferenceName,
    label: label,
    url: url,
    hash: fetched.hash || null,
    relevantText: fetched.relevantText || '',
    finalUrl: fetched.finalUrl || url,
    contentType: fetched.contentType || '',
    lastError: errorText || null
  };
}

function stripHtml_(input) {
  var text = input.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  text = decodeEntities_(text);
  text = text.replace(/\r/g, '\n');
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{2,}/g, '\n');
  return text;
}

function decodeEntities_(input) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function normalizeLines_(text) {
  var lines = text.split(/\n/);
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var line = String(lines[i]).replace(/\s+/g, ' ').trim();
    if (line) {
      out.push(line);
    }
  }
  return out;
}

function extractRelevantLines_(lines, extraKeywords) {
  var keywords = KEYWORDS.slice(0);
  if (extraKeywords && extraKeywords.length) {
    keywords = keywords.concat(extraKeywords);
  }
  var lower = [];
  for (var i = 0; i < keywords.length; i++) {
    lower.push(String(keywords[i]).toLowerCase());
  }

  var indices = {};
  for (var j = 0; j < lines.length; j++) {
    var lineLower = String(lines[j]).toLowerCase();
    var hit = false;
    for (var k = 0; k < lower.length; k++) {
      if (lineLower.indexOf(lower[k]) !== -1) {
        hit = true;
        break;
      }
    }
    if (hit) {
      for (var offset = -1; offset <= 1; offset++) {
        var idx = j + offset;
        if (idx >= 0 && idx < lines.length) {
          indices[idx] = true;
        }
      }
    }
  }

  var selected = [];
  var keys = Object.keys(indices);
  if (!keys.length) {
    return lines.slice(0, 120);
  }
  keys.sort(function(a, b) { return Number(a) - Number(b); });
  for (var n = 0; n < keys.length; n++) {
    selected.push(lines[Number(keys[n])]);
  }
  return selected;
}

function sha256_(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes);
}

function parseDate_(dateText) {
  if (!dateText) return null;
  var parts = String(dateText).split('-');
  if (parts.length !== 3) return null;
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function displayValue_(conf, key, fallback) {
  var displayKeys = [key + '_display'];
  if (key === 'registration_open_date') {
    displayKeys.push('registration_open_display');
  } else if (key === 'meeting_start_date') {
    displayKeys.push('meeting_start_display');
  }
  for (var i = 0; i < displayKeys.length; i++) {
    if (conf[displayKeys[i]]) return String(conf[displayKeys[i]]);
  }
  if (conf[key]) return String(conf[key]);
  return fallback || '待公布';
}

function daysBetween_(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

function deriveStatus_(conf, today) {
  var regOpen = parseDate_(conf.registrationOpenDate);
  var regDeadline = parseDate_(conf.registrationDeadline);
  var meetingStart = parseDate_(conf.meetingStartDate);
  var meetingEnd = parseDate_(conf.meetingEndDate);

  var status = '未开放';
  if (regDeadline && today > regDeadline) {
    status = '已截止';
  } else if (meetingEnd && today > meetingEnd) {
    status = '已截止';
  } else if (regOpen && today < regOpen) {
    status = '未开放';
  } else if (regDeadline && daysBetween_(today, regDeadline) >= 0 && daysBetween_(today, regDeadline) <= 14) {
    status = '即将截止';
  } else if (regOpen && today >= regOpen) {
    status = '已开放';
  } else if (String(conf.registrationOpenDisplay) === '已开放') {
    status = '已开放';
  }

  var action = '继续观望';
  if (status === '已开放' || status === '即将截止') {
    action = '现在去注册';
  } else if (meetingStart && daysBetween_(today, meetingStart) >= 0 && daysBetween_(today, meetingStart) <= 120) {
    action = '先订酒店';
  }
  return { status: status, action: action };
}

function buildEvent_(conf, labels, reason, now) {
  var d = deriveStatus_(conf, now);
  return {
    会议: conf.name,
    地点: conf.venueDisplay || '待公布',
    票价: conf.priceDisplay || '待公布',
    报名开始时间: displayValue_(conf, 'registration_open_date', '待公布'),
    会议开始时间: displayValue_(conf, 'meeting_start_date', '待公布'),
    当前状态: d.status,
    建议动作: d.action,
    更新日期: formatDate_(now, TIMEZONE, 'yyyy-MM-dd'),
    变化内容: reason + '（' + labels.join('、') + '）',
    官方链接: conf.mainUrl,
    截止日期详情: conf.deadlineDisplay || '待公布'
  };
}

function isWithinLast30Days_(target, today) {
  if (!target) return false;
  var diff = daysBetween_(target, today);
  return diff >= 0 && diff <= 30;
}

function buildRepeatEvent_(conf, now) {
  var d = deriveStatus_(conf, now);
  var regOpen = parseDate_(conf.registrationOpenDate);
  var meetingStart = parseDate_(conf.meetingStartDate);
  var meetingEnd = parseDate_(conf.meetingEndDate);

  var ongoing = meetingStart && meetingEnd && now >= meetingStart && now <= meetingEnd;
  var recentlyOpened = isWithinLast30Days_(regOpen, now);
  var recentlyStarted = isWithinLast30Days_(meetingStart, now);
  var registrationActive = d.status === '已开放' || d.status === '即将截止';

  if (!(ongoing || recentlyOpened || recentlyStarted || registrationActive)) {
    return null;
  }

  var reason = '近一个月内仍需关注（报名中或会议进行中）';
  if (ongoing) {
    reason = '会议正在进行中';
  } else if (d.status === '即将截止') {
    reason = '报名即将截止';
  } else if (registrationActive) {
    reason = '报名仍在开放中';
  }

  return {
    会议: conf.name,
    地点: conf.venueDisplay || '待公布',
    票价: conf.priceDisplay || '待公布',
    报名开始时间: displayValue_(conf, 'registration_open_date', '待公布'),
    会议开始时间: displayValue_(conf, 'meeting_start_date', '待公布'),
    当前状态: d.status,
    建议动作: d.action,
    更新日期: formatDate_(now, TIMEZONE, 'yyyy-MM-dd'),
    变化内容: reason,
    官方链接: conf.mainUrl,
    截止日期详情: conf.deadlineDisplay || '待公布'
  };
}

function composeMessage_(events, prefix, now) {
  var lines = [prefix + '【AI顶会追踪｜' + formatDate_(now, TIMEZONE, 'yyyy-MM-dd HH:mm') + '】'];
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    lines.push('- 会议：' + e.会议);
    lines.push('  地点：' + e.地点);
    lines.push('  票价：' + e.票价);
    lines.push('  报名开始时间：' + e.报名开始时间);
    lines.push('  会议开始时间：' + e.会议开始时间);
    lines.push('  当前状态：' + e.当前状态);
    lines.push('  建议动作：' + e.建议动作);
    lines.push('  变化内容：' + e.变化内容);
    lines.push('  官方链接：' + e.官方链接);
    lines.push('  截止日期详情：' + e.截止日期详情);
  }
  return lines.join('\n');
}

function sendFeishu_(webhook, text) {
  var response = UrlFetchApp.fetch(webhook, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({
      msg_type: 'text',
      content: { text: text }
    }),
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();
  if (code >= 400) {
    throw new Error('Feishu HTTP ' + code + ': ' + response.getContentText());
  }
  return response.getContentText();
}

function saveState_(state) {
  PropertiesService.getScriptProperties().setProperty(STATE_PROPERTY, JSON.stringify(state));
}

function loadState_() {
  var raw = PropertiesService.getScriptProperties().getProperty(STATE_PROPERTY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function isStateEmpty_(pages) {
  return !pages || !Object.keys(pages).length;
}

function getWebhook_() {
  var webhook = PropertiesService.getScriptProperties().getProperty(FEISHU_PROPERTY);
  if (!webhook) {
    throw new Error('Missing script property: ' + FEISHU_PROPERTY);
  }
  return webhook;
}

function formatDate_(date, timezone, pattern) {
  return Utilities.formatDate(date, timezone, pattern);
}

function formatNow_() {
  return formatDate_(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm');
}
