#!/usr/bin/env node

const axios = require('axios');
const dns = require('dns').promises;

const whoisDomain = async (domain) => {
  try {
    const initialResponse = await axios.get('https://dnsimple.com/whois', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      }
    });

    const tokenMatch = initialResponse.data.match(/<meta name="csrf-token" content="([^"]+)"/);
    
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) throw new Error('Token not found!');

    const cookies = initialResponse.headers['set-cookie'];
    const cookieString = cookies ? cookies.join('; ') : '';

    const params = new URLSearchParams({
      '_method': 'put',
      'authenticity_token': token,
      'id': domain,
      'commit': 'Check domain'
    });

    const response = await axios.post('https://dnsimple.com/whois/query', params, {
      headers: {
        'authority': 'dnsimple.com',
        'accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': cookieString,
        'origin': 'https://dnsimple.com',
        'referer': 'https://dnsimple.com/whois',
        'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      }
    });

    const match = response.data.match(/<pre[^>]*>([^<]+)<\/pre>/s);
    const result = match ? match[1].trim() : response.data;

    const isFailure = /invalid request|no match for|unable to connect|domain not found/i.test(result);
    if (isFailure) {
      throw new Error(result);
    }

    return {
      success: true,
      message: result
    };

  } catch (error) {
    return {
      success: false,
      message: `${error.message}`
    };
  }
};

const hostToIP = async (host) => {
  try {
    const addresses = await dns.resolve4(host);
    
    return {
      success: true,
      message: addresses.join('\n')
    };
    
  } catch (err) {
    return {
      success: false,
      message: `${err.message}`
    };
  }
};

module.exports = {
    whoisDomain,
    hostToIP
};