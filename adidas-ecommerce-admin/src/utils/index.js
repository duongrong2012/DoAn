import { put } from '@redux-saga/core/effects';

import * as ActionTypes from '../redux/actionTypes';
import { imageListSeparator, responseError } from '../constants';
import { notification } from 'antd';

export const formatCurrency = (text = '') => {
  return text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader);
    reader.onerror = error => reject(error);
  });
}

export const getFormatImageSource = (imageSource) => {
  let customImageSource = imageSource.trim();

  if (!customImageSource.startsWith('http')) {
    customImageSource = `http://127.0.0.1:8000/${customImageSource}`
  }

  return customImageSource;
}

export async function createFile(url) {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: 'image/jpeg'
  };
  let file = new File([data], `${Date.now()}.jpg`, metadata);
  return file
  // ... do something with the file or return it
}

export const getImageListByString = (imageString, separator = imageListSeparator, formatImageSource = true) => {
  let imageList = imageString.split(separator).map((x) => x.trim());

  if (formatImageSource) {
    imageList = imageList.map(getFormatImageSource);
  }

  return imageList;
}

export const getFileNameByUrl = (fileUrl) => {
  const pathArray = fileUrl.split('/');

  if (!pathArray.length) return '';

  return pathArray[pathArray.length - 1];
};

export const apiErrorHandler = (error) => {
  const errorMessage = error.response?.data?.message ?? error.message;

  notification.error({
    message: errorMessage,
  });

  return errorMessage
}
