/**
 * 将note转为markdown文件
 * key: @后的关键词
 * 
 * */
function transform(key, val, template, note) {
    if (typeof template == 'function') {
        return template(key, val, template, note);
    } else if (typeof template == 'string') {
        return template.replace(/\{(\w*)\}/g, function (all, replace) {
            replace = replace.toLowerCase();
            if (replace == 'key') {
                return key;
            } else if (replace == 'val') {
                return val;
            } else if (note[replace]) {
                return note[replace];
            }
        });
    } else {
        return '**' + key + '**\n```' + val + '\n```';
    }
}

module.exports = function (note, config) {
    var template = config.Template, flag = 0, out = '';
    if (note.firstKey && note.firstKeyVal && config.Template[note.firstKey]) {
        flag += 1;
        out += transform(note.firstKey, note.firstKeyVal, template[note.firstKey], note) + '\n';
    }
    if (note.notes && note.notes.length > flag) {
        for (; flag < note.notes.length; flag++) {
            var temp = note.notes[flag];
            out += transform(temp.key, temp.val, template[temp.key], note) + '\n';
        }
    }
    return out;
};