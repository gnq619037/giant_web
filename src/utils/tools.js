import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';

/* nidbElements: element Object
   isSort: ture||false(undefined,null)
*/
export function getAntdTableColGroup(nidbElements, isSort) {
  return nidbElements.map((ele) => {
    const unit = (ele.type === 'int' || ele.type === 'decimal') &&
      ele.extendSet.find(ext => ext.key === 'unit') && ele.extendSet.find(ext => ext.key === 'unit').value;

    const col = {
      title: unit ? `${ele.name} (${unit})` : ele.name,
      dataIndex: ele.code,
      key: `${ele.code}`,
      width: ele.columnwidth || 150,
      sorter: isSort && true,
      render: (text) => {
        let newText = null;
        let showtime = false;
        let options = [];
        let combos = [];
        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
        let precision = 2;

        switch (ele.type) {
          case 'string':
          case 'int':
          case 'text':
            newText = text;
            break;
          case 'decimal':
            precision = (ele && ele.extendSet.find(ext => ext.key === 'precision') &&
                                ele.extendSet.find(ext => ext.key === 'precision').value) || 2;
            newText = text && parseFloat(text).toFixed(precision);
            break;
          case 'password':
            newText = '********';
            break;
          case 'select':
          case 'radio':
            options = JSON.parse(ele.extendSet.find(ext => ext.key === 'options').value);
            newText = text && options.find(op => op.key === `${text}`) && options.find(op => op.key === `${text}`).value;
            break;
          case 'combo':
            combos = JSON.parse(ele.extendSet.find(ext => ext.key === 'combo').value).combo;
            options = text && text.split(',')[0] && combos.find(el => el.comboFieldK === text.split(',')[0]).options;
            newText = text && options.find(op => op.key === `${text.split(',')[1]}`) && options.find(op => op.key === `${text.split(',')[1]}`).value;
            break;
          case 'checkbox':
            options = JSON.parse(ele.extendSet.find(ext => ext.key === 'options').value);
            newText = text &&
                        text.split(',').map(x => options.find(op => op.key === `${x}`) &&
                          options.find(op => op.key === `${x}`).value).toString();
            break;
          case 'boolean':
            newText = text ? '是' : '否';
            break;
          case 'datetime':
            showtime = ele && ele.extendSet.find(ext => ext.key === 'showtime') &&
                        ele.extendSet.find(ext => ext.key === 'showtime').value;
            showtime = showtime === 'true' || showtime === true;

            dateFormat = showtime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
            newText = text && moment(text * 1000).format(dateFormat);
            break;
          default:
            newText = text;
        }
        // return newText;
        return beautText(newText, ele.columnwidth);
      },
    };
    return col;
  });
}

export function beautText(text, defaultWidth) {
  const maxLength = parseInt((defaultWidth || 150) / 12, 10);
  if (text !== undefined && text !== null) {
    if (text.length > maxLength - 2) {
      return (
        <p><Tooltip title={text}>{text.substring(0, maxLength - 2)} ...</Tooltip></p>
      );
    } else {
      return (<p>{text}</p>);
    }
  } else {
    return (<p />);
  }
}

export function getFormedDataByElements(element, value) {
  let newText = null;
  let showtime = false;
  let options = [];
  let dateFormat = 'YYYY-MM-DD HH:mm:ss';
  let precision = 2;
  if (element.type === 'datetime') {
    showtime = element.extendSet.find(ext => ext.key === 'showtime') &&
                element.extendSet.find(ext => ext.key === 'showtime').value;
    showtime = showtime === 'true' || showtime === true;
    dateFormat = showtime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    newText = value && moment(value * 1000).format(dateFormat);
  } else if (element.type === 'boolean') {
    newText = value && (value ? '是' : '否');
  } else if (element.type === 'select' || element.type === 'radio') {
    options = JSON.parse(element.extendSet.find(ext => ext.key === 'options').value);
    newText = value && options.find(op => op.key === value) && options.find(op => op.key === value).value;
  } else if (element.type === 'checkbox') {
    options = JSON.parse(element.extendSet.find(ext => ext.key === 'options').value);
    newText = value &&
                value.split(',').map(x => options.find(op => op.key === x) &&
                  options.find(op => op.key === x).value).toString();
  } else if (element.type === 'combo') {
    const combo = JSON.parse(element.extendSet.find(ext => ext.key === 'combo').value);
    const optionss = value && combo.combo.find(el => el.comboFieldK === value.split(',')[0]).options;
    newText = optionss && optionss.find(op => op.key === `${value.split(',')[1]}`) && optionss.find(op => op.key === `${value.split(',')[1]}`).value;
  } else if (element.type === 'password') {
    newText = value && '********';
  } else if (element.type === 'decimal') {
    precision = (element.extendSet.find(ext => ext.key === 'precision') &&
                      element.extendSet.find(ext => ext.key === 'precision').value) || 2;
    newText = value && parseFloat(value).toFixed(precision);
  } else {
    newText = value && value;
  }
  return newText;
}

export function ipToLong(ip) {
  let num = 0;
  if (ip === '') {
    return num;
  }
  const aNum = ip.split('.');
  if (aNum.length !== 4) {
    return num;
  }
  num += parseInt(aNum[3], 10) << 24;
  num += parseInt(aNum[2], 10) << 16;
  num += parseInt(aNum[1], 10) << 8;
  num += parseInt(aNum[0], 10) << 0;
  num >>>= 0;
  return num;
}
