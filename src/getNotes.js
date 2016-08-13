/**
 * 根据内容,读取其中注释
 * 输出内容:
 * 假如存在注释,输出注释数组,格式[
 *      {
 *          note: '',// 注释内容,删除掉其中*和*前的空格
 *          _note: '', // 注释原文
 *          nextLine: ''// 下一行内容
 *          firstKey: '',
 *      },…
 * ]
 * 不存在注释,则返回null
 * */
module.exports = function (source) {
    if (!source || typeof source != 'string') {
        return null;
    }
    var list = [];
    source.replace(/\/\*\*([\w\W]*?)\*\/[\s\n]*([^\n]*)/g, function (all, _note, nextLine) {
        var note = {
            _note: _note,
            nextLine: nextLine
        };
        // 删除每行开始的*
        _note = note.note = note._note.replace(/\n\s*\*\s?/g, '\n').trim();

        //console.log(_note);

        note.note.replace(/(^|\n)\s*@(\w*)/g, function (all, ch, key, index) {
            var start = index + all.length - 1;
            var end = _note.indexOf('\n@', start);
            var val = end > 0 ? _note.substring(start + 1, end) : _note.substring(start + 1);
            if (val) {
                val = val.trimRight();
            }
            // console.log('key:', key, val, '\n---------');
            if (key == 'index') {
                // index 是用来排序的
                note.index = parseInt(val) || 0;
                return;
            }
            var isFirst = false;
            if (!note.firstKey) {
                note.firstKey = key.trim();
                if (val && val.length > 0) {
                    note.firstKeyVal = val;
                }
                note.notes = [];
                isFirst = true;
            }
            note.notes.push({key: key, val: val});
            if (isFirst && index > 0) {
                var desc = note.note.substr(0, index).trimRight();
                if (desc) {
                    note.notes.push({key: 'desc', val: desc});
                }
            }
        });

        note.index = note.index || 0;

        list.push(note);
    });
    return list;
};