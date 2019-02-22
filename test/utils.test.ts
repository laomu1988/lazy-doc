/**
 * @file 测试代码
 */
/* eslint-disable fecs-camelcase */
/* global test */

let utils = require('../src/utils');

test('utils.getFunctionName', () => {
    let matchs = [
        {source: `function test(`, dest: `test`},
        {source: ` function test (`, dest: `test`},
        {source: ` test (`, dest: `test`},
        {source: `test(`, dest: `test`},
        {source: `a test (`, dest: `test`},
        {source: ``, dest: ``},
        {source: `// test()`, dest: ``},
    ];
    matchs.forEach(({source, dest}) =>
        expect(utils.getFunctionName(source)).toBe(dest)
    )
});

let notes = [
    {
        source: '/**test1*/ /***/\ntest',
        dest: 'test1',
        len: 2,
        nextLine: '/***/'
    },
    {
        source: ` /**\n* @file 测试文件\n*/\nfunction a()`,
        dest: `@file 测试文件`,
        nextLine: 'function a()'
    },
    {
        // 测试注释和内容分离
        source: ` /***/\n\nfunction a()`,
        dest: '',
        nextLine: '',
    },
    {
        source: `/***/`,
        dest: ``,
        nextLine: '',
    },
];
test('utils.getNotes', () => {
    notes.forEach(({source, dest, nextLine, len}) => {
        let notes = utils.getNotes(source);
        expect(notes[0].content).toBe(dest)
        expect(notes[0].nextLine).toBe(nextLine)
        if (len) {
            expect(notes.length).toBe(len)
        }
    })
});

test('utils.getNoteMark', () => {
    notes.forEach(({source, dest, nextLine, len}) => {
        let notes = utils.getNotes(source);
        let mark = utils.getNoteMark(notes[0]);
        console.log('mark:', JSON.stringify(mark));
    })
});


test('utils.transform', () => {
    let source = [
        {key: 'file', value: 'name', template: '# {value}', result: '# name'},
    ];
    source.forEach((s) => {
        expect(utils.transform(s.key, s.value, s.template)).toBe(s.result);
    })
});

let source = [
    [
        '普通参数',
        '{string} test 测试参数',
        {type: 'string', name: 'test', desc: '测试参数', optional: false}
    ],
    [
        '可选参数',
        '{string} [test] 测试参数',
        {type: 'string', name: 'test', desc: '测试参数', optional: true},
    ],
    // [
    //     '默认值',
    //     '{string} [test=abc dd] 测试参数',
    //     {type: 'string', name: 'test', desc: '测试参数', optional: true, default: 'abc dd'},
    // ],
];
test.each(source)('utils.parseParam %s', (name, str, result) => {
    expect(utils.parseParam(str)).toEqual(result);
});
