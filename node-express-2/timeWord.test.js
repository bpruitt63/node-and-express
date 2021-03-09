const timeWord = require('./timeWord');

describe('#timeword', () => {
  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });

  test('midnight', function(){
    const res = timeWord('00:00');
    expect(res).toEqual('midnight')
  })

  test('00-12am', function(){
    const res = timeWord('00:12');
    expect(res).toEqual('twelve twelve am')
  })

  test("o'clock", function(){
    const res = timeWord('01:00');
    expect(res).toEqual("one o'clock am")
  })

  test('oh one', function(){
    const res = timeWord('06:01');
    expect(res).toEqual('six oh one am')
  })

  test('ten', function(){
    const res = timeWord('06:10');
    expect(res).toEqual('six ten am')
  })

  test('teen', function(){
    const res = timeWord('06:18');
    expect(res).toEqual('six eighteen am')
  })

  test('thirty', function(){
    const res = timeWord('06:30');
    expect(res).toEqual('six thirty am')
  })

  test('34', function(){
    const res = timeWord('10:34');
    expect(res).toEqual('ten thirty four am')
  })

  test('noon', function(){
    const res = timeWord('12:00');
    expect(res).toEqual('noon')
  })

  test('afternoon', function(){
    const res = timeWord('12:09');
    expect(res).toEqual('twelve oh nine pm')
  })

  test('11pm', function(){
    const res = timeWord('23:23');
    expect(res).toEqual('eleven twenty three pm')
  })
});
