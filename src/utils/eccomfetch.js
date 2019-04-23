import fetch from 'dva/fetch';
import { apihost } from './config';

export async function get(url) {
  const response = await fetch(apihost + url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Eccom-Token': window.localStorage.getItem('Eccom-Token'),
    },
  });

  const { status } = response;
  if (status === 401) {
    window.location.href = '/login';
    // window.localStorage.removeItem('Eccom-Token');
  } else {
    return response.json()
      .then((json) => {
        return {
          fetchSuccess: true,
          ...json,
        };
      }).catch((error) => {
        return {
          fetchSuccess: false,
          statusCode: status,
          message: error.message,
        };
      });
  }
}

export async function post(url, params) {
  const response = await fetch(apihost + url, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Eccom-Token': window.localStorage.getItem('Eccom-Token'),
    },
    body: JSON.stringify(params),
  });
  const { status } = response;
  if (status === 401) {
    window.location.href = '/login';
    // window.localStorage.removeItem('Eccom-Token');
  } else {
    return response.json()
      .then((json) => {
        return {
          fetchSuccess: true,
          ...json,
        };
      }).catch((error) => {
        return {
          fetchSuccess: false,
          statusCode: status,
          message: error.message,
        };
      });
  }
}

// url:ResquestMapping, params: filePath(文件绝对路径,如D:/***/****/**.*例:NidbController.downloadData)
export async function postToDownload(url, params) {
  const forceDownload = function (blob, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    // a.click();
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  };

  const response = await fetch(apihost + url, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Eccom-Token': window.localStorage.getItem('Eccom-Token'),
    },
    body: JSON.stringify(params),
  });

  const { status } = response;
  if (status === 401) {
    window.location.href = '/login';
    // window.localStorage.removeItem('Eccom-Token');
  } else {
    return (response.blob())
      .then((blob) => {
        const headerStr = response.headers.get('Content-Disposition');
        const fileName = headerStr.substring(headerStr.indexOf('fileName') + 'fileName='.length);
        const blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, fileName);
        window.URL.revokeObjectURL(blobUrl);
      }).catch((error) => {
        console.log(error);
        return {
          fetchSuccess: false,
          statusCode: status,
          message: error.message,
        };
      });
  }
}

export async function deleteData(url, params) {
  const response = await fetch(apihost + url, {
    credentials: 'same-origin',
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // 'Eccom-Token': window.localStorage.getItem('Eccom-Token'),
    },
    body: JSON.stringify(params),
  });
  const { status } = response;
  if (status === 401) {
    window.location.href = '/login';
    // window.localStorage.removeItem('Eccom-Token');
  } else {
    return response.json()
      .then((json) => {
        return {
          fetchSuccess: true,
          ...json,
        };
      }).catch((error) => {
        return {
          fetchSuccess: false,
          statusCode: status,
          message: error.message,
        };
      });
  }
}

export async function postJs(url, params) {
  const response = await fetch(apihost + url, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Eccom-Token': window.localStorage.getItem('Eccom-Token'),
    },
    body: JSON.stringify(params),
  });
  const { status } = response;
  if (status === 401) {
    window.location.href = '/login';
    // window.localStorage.removeItem('Eccom-Token');
  } else {
    return response.json();
  }
}
