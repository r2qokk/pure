import test from 'ava';
import * as urlParser from '../src/services/url-parser';

test('urlParser.getDomainName', t => {
  t.is('lesspass.com', urlParser.getDomainName('https://lesspass.com/#!/'));
  t.is('lesspass.com', urlParser.getDomainName('https://lesspass.com/api/'));
  t.is('api.lesspass.com', urlParser.getDomainName('https://api.lesspass.com/'));
  t.is('lesspass.com', urlParser.getDomainName('http://lesspass.com'));
  t.is('stackoverflow.com', urlParser.getDomainName('http://stackoverflow.com/questions/3689423/google-chrome-plugin-how-to-get-domain-from-url-tab-url'));
  t.is('v4-alpha.getbootstrap.com', urlParser.getDomainName('http://v4-alpha.getbootstrap.com/components/buttons/'));
  t.is('accounts.google.com', urlParser.getDomainName('https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier'));
  t.is('www.netflix.com', urlParser.getDomainName('https://www.netflix.com/browse'));
  t.is('www.bbc.co.uk', urlParser.getDomainName('https://www.bbc.co.uk'));
  t.is('192.168.1.1:10443', urlParser.getDomainName('https://192.168.1.1:10443/webapp/'));
  t.is('', urlParser.getDomainName(undefined));
});

test('get current tab', t => {
  const url = 'https://example.org';
  global.chrome = {
    tabs: {
      query(a, callback){
        callback([{url}])
      }
    }
  };
  return urlParser.getSite().then(response => {
    t.is(response.url, url);
    t.is(response.site, 'example.org')
  });
});

test('getPasswordFromUrlQuery', t => {
  const query = {
    login: "test@example.org",
    site: "example.org",
    uppercase: "true",
    lowercase: "true",
    numbers: "true",
    symbols: "false",
    length: "16",
    counter: "1",
    version: "2"
  };
  const expectedPassword = {
    login: "test@example.org",
    site: "example.org",
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    length: 16,
    counter: 1,
    version: 2
  };
  t.deepEqual(urlParser.getPasswordFromUrlQuery(query), expectedPassword);
});

test('getPasswordFromUrlQuery booleanish', t => {
  const query = {
    uppercase: "true",
    lowercase: "TrUe",
    numbers: "1",
    symbols: "0",
  };
  const expectedPassword = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  };
  t.deepEqual(urlParser.getPasswordFromUrlQuery(query), expectedPassword);
});
