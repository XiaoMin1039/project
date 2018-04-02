const menu = [{
        name: '交易管理',
        icon: 'list-alt',
        path: '',
        children: [{
                name: '订单管理',
                icon: '',
                path: '/orderManage',
                value: 'OrderManage'
            },
            {
                name: '远程监控',
                icon: '',
                path: '/orderControl',
                value: 'OrderControl'
            },
            {
                name: '监控日志',
                icon: '',
                path: '/orderControlList',
                value: 'OrderControlList'
            },
            {
                name: 'PC日志记录',
                icon: '',
                path: '/pcLogRecords',
                value: 'PcLogRecords'
            }
        ]
    },
    {
        name: '宝贝管理',
        icon: 'shopping-bag',
        path: '',
        children: [{
                name: '管理宝贝',
                icon: '',
                path: '/commodityManage',
                value: 'CommodityManage'
            },
            {
                name: '账号审核',
                icon: '',
                path: '/accountVerify',
                value: 'AccountVerify'
            },
            {
                name: '账号审核',
                icon: '',
                path: '',
                value: 'Verify',
                hide: true
            }
        ]
    },
    {
        name: '上号器管理',
        icon: 'shield',
        path: '',
        children: [{
                name: '程序白名单',
                icon: '',
                path: '/programAdmin',
                value: 'ProgramAdmin'
            },
            {
                name: '关键词管理',
                icon: '',
                path: '/keysAdmin',
                value: 'KeysAdmin'
            }
        ]
    },
    {
        name: '账号管理',
        icon: 'id-card',
        path: '',
        children: [{
                name: '用户管理',
                icon: '',
                path: '/userManage',
                value: 'UserManage'
            },
            {
                name: '代理商管理',
                icon: '',
                path: '/agentManage',
                value: 'AgentManage'
            }
        ]
    },
    {
        name: '资金管理',
        icon: 'jpy',
        path: '',
        children: [{
                name: '用户提现',
                icon: '',
                path: '/userWithdrawCash',
                value: 'UserWithdrawCash'
            },
            {
                name: '代理商提现',
                icon: '',
                path: '/agentWithdrawCash',
                value: 'AgentWithdrawCash'
            },
            {
                name: '用户充值记录',
                icon: '',
                path: '/userCharge',
                value: 'UserCharge'
            }
        ]
    },
    {
        name: '售后中心',
        icon: 'user-circle',
        path: '',
        children: [{
                name: '仲裁管理',
                icon: '',
                path: '/arbitrationManage',
                value: 'ArbitrationManage'
            },
            {
                name: '仲裁管理',
                icon: '',
                path: '/arbitration',
                value: 'Arbitration',
                hide: true
            }
        ]
    },
    {
        name: '网站设置',
        icon: 'desktop',
        path: '',
        children: [{
                name: '搜索关键词',
                icon: '',
                path: '/hotKeys',
                value: 'HotKeys'
            },
            {
                name: '新闻中心',
                icon: '',
                path: '/news',
                value: 'News'
            },
            {
                name: '买家帮助中心',
                icon: '',
                path: '/buyerNews',
                value: 'BuyerNews'
            },
            {
                name: '卖家帮助中心',
                icon: '',
                path: '/sellerNews',
                value: 'SellerNews'
            },
            {
                name: 'Banner管理',
                icon: '',
                path: '/banner',
                value: 'Banner'
            },
            {
                name: '图片管理',
                icon: '',
                path: '/imageAdmin',
                value: 'ImageAdmin'
            },
            {
                name: '游戏管理',
                icon: '',
                path: '/gameControl',
                value: 'GameControl'
            }
        ]
    }
]
export default menu