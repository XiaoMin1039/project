import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = r => require.ensure(['@/pages/Login.vue'], () => r(require('@/pages/Login.vue')), 'login')
const ComponentsTest = r =>
    require.ensure(['@/pages/ComponentsTest.vue'], () => r(require('@/pages/ComponentsTest.vue')), 'ComponentsTest')
const OrderManage = r =>
    require.ensure(['@/pages/OrderManage.vue'], () => r(require('@/pages/OrderManage.vue')), 'OrderManage')
const OrderControl = r =>
    require.ensure(['@/pages/OrderControl.vue'], () => r(require('@/pages/OrderControl.vue')), 'OrderControl')
const OrderControlList = r =>
    require.ensure(['@/pages/OrderControlList.vue'], () => r(require('@/pages/OrderControlList.vue')), 'OrderControlList')
const PcLogRecords = r =>
    require.ensure(['@/pages/PcLogRecords.vue'], () => r(require('@/pages/PcLogRecords.vue')), 'PcLogRecords')
const CommodityManage = r =>
    require.ensure(['@/pages/CommodityManage.vue'], () => r(require('@/pages/CommodityManage.vue')), 'Commodity')
const AccountVerify = r =>
    require.ensure(['@/pages/AccountVerify.vue'], () => r(require('@/pages/AccountVerify.vue')), 'Commodity')
const Verify = r => require.ensure(['@/pages/Verify.vue'], () => r(require('@/pages/Verify.vue')), 'Commodity')
const Arbitration = r =>
    require.ensure(['@/pages/Arbitration.vue'], () => r(require('@/pages/Arbitration.vue')), 'Customer')
const ArbitrationManage = r =>
    require.ensure(['@/pages/ArbitrationManage.vue'], () => r(require('@/pages/ArbitrationManage.vue')), 'Customer')
const UserWithdrawCash = r =>
    require.ensure(['@/pages/UserWithdrawCash.vue'], () => r(require('@/pages/UserWithdrawCash.vue')), 'Money')
const AgentWithdrawCash = r =>
    require.ensure(['@/pages/AgentWithdrawCash.vue'], () => r(require('@/pages/AgentWithdrawCash.vue')), 'Money')
const UserCharge = r => require.ensure(['@/pages/UserCharge.vue'], () => r(require('@/pages/UserCharge.vue')), 'Money')
const AgentManage = r => require.ensure(['@/pages/AgentManage.vue'], () => r(require('@/pages/AgentManage.vue')), 'Id')
const UserManage = r => require.ensure(['@/pages/UserManage.vue'], () => r(require('@/pages/UserManage.vue')), 'Id')
const SellerNews = r => require.ensure(['@/pages/SellerNews.vue'], () => r(require('@/pages/SellerNews.vue')), 'Admin')
const BuyerNews = r => require.ensure(['@/pages/BuyerNews.vue'], () => r(require('@/pages/BuyerNews.vue')), 'Admin')
const News = r => require.ensure(['@/pages/News.vue'], () => r(require('@/pages/News.vue')), 'Admin')
const HotKeys = r => require.ensure(['@/pages/HotKeys.vue'], () => r(require('@/pages/HotKeys.vue')), 'Admin')
const Banner = r => require.ensure(['@/pages/Banner.vue'], () => r(require('@/pages/Banner.vue')), 'Admin')
const ProgramAdmin = r =>
    require.ensure(['@/pages/ProgramAdmin.vue'], () => r(require('@/pages/ProgramAdmin.vue')), 'PC')
const KeysAdmin = r => require.ensure(['@/pages/KeysAdmin.vue'], () => r(require('@/pages/KeysAdmin.vue')), 'PC')
const ImageAdmin = r => require.ensure(['@/pages/ImageAdmin.vue'], () => r(require('@/pages/ImageAdmin.vue')), 'PC')
const GameControl = r => require.ensure(['@/pages/GameControl.vue'], () => r(require('@/pages/GameControl.vue')), 'PC')
export default new Router({
    mode: 'history',
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/',
            name: 'test',
            component: ComponentsTest
        },
        {
            path: '/orderManage',
            name: 'OrderManage',
            component: OrderManage
        },
        {
            path: '/orderControl',
            name: 'OrderControl',
            component: OrderControl
        },
        {
            path: '/commodityManage',
            name: 'CommodityManage',
            component: CommodityManage
        },
        {
            path: '/arbitrationManage',
            name: 'ArbitrationManage',
            component: ArbitrationManage
        },
        {
            path: '/arbitration/:id',
            name: 'Arbitration',
            component: Arbitration
        },
        {
            path: '/userWithdrawCash',
            name: 'UserWithdrawCash',
            component: UserWithdrawCash
        },
        {
            path: '/agentWithdrawCash',
            name: 'AgentWithdrawCash',
            component: AgentWithdrawCash
        },
        {
            path: '/accountVerify',
            name: 'AccountVerify',
            component: AccountVerify
        },
        {
            path: '/verify/:id',
            name: 'Verify',
            component: Verify
        },
        {
            path: '/agentManage',
            name: 'AgentManage',
            component: AgentManage
        },
        {
            path: '/userManage',
            name: 'UserManage',
            component: UserManage
        },
        {
            path: '/buyerNews',
            name: 'BuyerNews',
            component: BuyerNews
        },
        {
            path: '/sellerNews',
            name: 'SellerNews',
            component: SellerNews
        },
        {
            path: '/news',
            name: 'News',
            component: News
        },
        {
            path: '/programAdmin',
            name: 'ProgramAdmin',
            component: ProgramAdmin
        },
        {
            path: '/keysAdmin',
            name: 'KeysAdmin',
            component: KeysAdmin
        },
        {
            path: '/hotKeys',
            name: 'HotKeys',
            component: HotKeys
        },
        {
            path: '/banner',
            name: 'Banner',
            component: Banner
        },
        {
            path: '/imageAdmin',
            name: 'ImageAdmin',
            component: ImageAdmin
        },
        {
            path: '/gameControl',
            name: 'GameControl',
            component: GameControl
        },
        {
            path: '/userCHarge',
            name: 'UserCharge',
            component: UserCharge
        },
        {
            path: '/orderControlList',
            name: 'OrderControlList',
            component: OrderControlList
        },
        {
            path: '/pcLogRecords',
            name: 'PcLogRecords',
            component: PcLogRecords
        }
    ]
})