const expect = require('expect')
const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'jen'
    const text = 'some msg'
    const message = generateMessage(from ,text)

    expect(typeof(message.createdAt)).toBe('number')
    expect(message).toMatchObject({
      from,
      text
    })
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'test'
    const latitude = 1
    const longitude = 2
    const url = 'https://www.google.com/maps?q=1,2'
    const message = generateLocationMessage(from, latitude, longitude)

    expect(typeof(message.createdAt)).toBe('number')
    expect(message).toMatchObject({
      from,
      url
    })
  })
})