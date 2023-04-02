const {normalizeURL} = require('./crawl.js')
const {test, expect} = require('@jest/globals')


test('normalizeURL strip protocol', () => {
    const input = 'https://www.1mg.com/path'
    const actual = normalizeURL(input)
    const expected = 'www.1mg.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://www.1mg.com/path/'
    const actual = normalizeURL(input)
    const expected = 'www.1mg.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://WWW.1mg.com/path'
    const actual = normalizeURL(input)
    const expected = 'www.1mg.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://www.1mg.com/path'
    const actual = normalizeURL(input)
    const expected = 'www.1mg.com/path'
    expect(actual).toEqual(expected)
})