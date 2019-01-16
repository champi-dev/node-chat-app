const expect = require('expect')
const { generateMessage } = require('./message')

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