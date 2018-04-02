//押金设置引入选择插件
var depositOptions=[{
    value: '0',
    label: '免押金',
    type: 'primary'
},{
    value: '1',
    label: '自定义押金',
    type: 'unit',
    unit: {
        unit: '元',
        max: 20,
        min: 0,
        array: [0,1,2, 4, 5,6, 8,10,12,15,18,20],
        prefix: '押金：',
        decimal: true,
        digit: 1
    }
}];
$deposit=$('#deposit').select(depositOptions,'0');

//代理商分成引入选择插件
var rateOptions=[{
    value: '0',
    label: '不分成',
    type: 'primary'
},{
    value: '1',
    label: '分成',
    type: 'unit',
    unit: {
        unit: '%',
        max: 100,
        min: 0,
        array: [10,20, 30, 40, 50,60,70,80,90, 100],
        decimal: false,
        multiple: 10
    }
}];
$rate=$('#rate').select(rateOptions,'0');

//4个允许引入选择插件+wegame+到时下线
var options={
    one:[
        {
            value: '0',
            label: '不允许',
            type: 'primary'
        },{
            value: '1',
            label: '允许',
            type: 'primary'
        }
    ],
    two:[
        {
            value: '0',
            label: '不允许',
            type: 'primary'
        },{
            value: '1',
            label: '允许',
            type: 'primary'
        }
    ],
    three:[
        {
            value: '0',
            label: '到时下线',
            type: 'primary'
        },{
            value: '1',
            label: '不下线',
            type: 'primary'
        }
    ]
};
$submitRank=$('#submitRank').select(options.one,'0');
$submitUseGold=$('#submitUseGold').select(options.one,'0');
$submitLeaveGame=$('#submitLeaveGame').select(options.one,'0');
$submitFeed=$('#submitFeed').select(options.one,'0');
$submitTGP=$('#submitTGP').select(options.two,'0');
$submitTimeOut=$('#submitTimeOut').select(options.three,'0');

//冻结次数限制引入选择插件
var maxViolationOptions=[{
    value: '0',
    label: '不限制',
    type: 'primary'
},{
    value: '1',
    label: '自定义',
    type: 'unit',
    unit: {
        unit: '次',
        max: 10000,
        min: 0,
        array: [1,2, 4, 5, 8,10,12,15,20, 30],
        decimal: false
    }
}];
$maxViolation=$('#maxViolation').select(maxViolationOptions,'0');

//最短租赁时间引入选择插件
var minHoursOptions=[{
    value: '0',
    label: '不限制',
    type: 'primary'
},{
    value: '1',
    label: '自定义',
    type: 'unit',
    unit: {
        unit: '小时',
        max: 5,
        min: 1,
        array: [1,2,3,4,5],
        decimal: false
    }
}];
$minHours=$('#minHours').select(minHoursOptions,'0');

// //免费赠送时间引入选择插件
// var postTimeOptions=[{
//     value: '0',
//     label: '不赠送',
//     type: 'primary'
// },{
//     value: '1',
//     label: '分钟',
//     type: 'unit',
//     unit: {
//         unit: '分钟',
//         max: 10000,
//         min: 1,
//         array: [1,2, 4, 5, 8,10,12,15,20, 100],
//         decimal: false
//     }
// },{
//     value: '2',
//     label: '小时',
//     type: 'unit',
//     unit: {
//         unit: '小时',
//         max: 10000,
//         min: 1,
//         array: [1,2, 4, 5, 8,10,12,15,20, 100],
//         decimal: false
//     }
// }];
// $postTime=$('#postTime').select(postTimeOptions,'0');
//
//
