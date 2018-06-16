import request from './request'

const host = request.config.baseURL;
const prefix = '/api';

export const getBanners = () => { return request.get(`${host}${prefix}/bannerlist`) };
export const getIntro = () => { return request.get(`${host}${prefix}/intro`) };
export const getCategorys = () => { return request.get(`${host}${prefix}/categorys`) };
export const getProducts = params => { return request.get(`${host}${prefix}/products`, params) };
export const getProductDetail = id => { return request.get(`${host}${prefix}/products?id=${id}`) };
export const getNews = params => { return request.get(`${host}${prefix}/news`, params)};
export const getNewsDetail = id => { return request.get(`${host}${prefix}/news?id=${id}`)};
export const getContacts = () => { return request.get(`${host}${prefix}/contacts`)};
export const getPartner = () => { return request.get(`${host}${prefix}/partner`)};
