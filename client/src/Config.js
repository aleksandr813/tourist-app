const CONFIG = {

townList: {
    MOSCOW: 'Москва',
},

HOST: process.env.REACT_APP_HOST ?? "http://localhost:3003/api",

STATIC_HOST: process.env.REACT_APP_STATIC_HOST ?? "http://localhost:3003",

MAPGL_KEY: process.env.REACT_APP_MAPGL_KEY ?? "",

BOT_NAME: process.env.REACT_APP_BOT_NAME ?? "",

INIT_DATA_HEADER: "X-Max-Init-Data",

SHARE_ROUTE_PREFIX: "route_",

DEV_USER_ID: "dev-user",

}

export default CONFIG;