/**
 * @file 将note转为markdown文件
 * key: @后的关键词
 *
 **/

function transform(key, val, template, index, note, config) {
    var type = typeof template;
    if (type !== 'function' && type !== 'string' && config.default) {
        template = config.default;
    }

    if (typeof template === 'function') {
        return template(key, val, index, note);
    }
    else if (typeof template === 'string') {
        return template.replace(/\{(\w*)\}/g, function (all, replace) {
            replace = replace.toLowerCase();
            if (replace === 'key') {
                return key;
            }
            else if (replace === 'val') {
                return val;
            }
            else if (note[replace]) {
                return note[replace];
            }

        });
    }
    else {
        return '**' + key + '**\n```' + val + '\n```';
    }
}

module.exports = function (note, config) {
    var template = config || {};
    var index = 0;
    var out = '';
    if (note.firstKey && note.firstKeyVal && template[note.firstKey]) {
        // 转换类型
        index += 1;
        out += transform(note.firstKey, note.firstKeyVal, template[note.firstKey], index, note, config) + '\n';
    }

    if (note.notes && note.notes.length > index) {
        // 转换notes
        for (; index < note.notes.length; index++) {
            var temp = note.notes[index];
            out += transform(temp.key, temp.val, template[temp.key], index, note, config) + '\n';
        }
    }

    return out;
};
