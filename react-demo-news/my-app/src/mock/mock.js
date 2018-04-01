var Mock = require('mockjs')
var data = Mock.mock('/api/data',{
    "data|5": [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1':10000,
        'img': Mock.Random.image('900x360', '#2d8cf0')
    }]
})