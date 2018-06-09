import request from './request'

const host = request.config.baseURL;
const prefix = '/api';

export const getBanners = () => { return request.get(`${host}${prefix}/bannerlist`) };
