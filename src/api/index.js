import request_8088 from '../utils/request_8088';
import request_9292 from '../utils/request_9292';
import qs from 'qs'
let a=''
// let a='/api'
// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };
// export const fetchMaterialData = query => {
//     return request({
//         url: './material.json',
//         method: 'get',
//         params: query
//     });
// };
export const Vehicle_get = (url) => {
    return request_8088({
        url: a+'/vehicle/'+url,
        // url: '/api/vehicle/'+url,
        method: 'get',

    });
};
export const Vehicle_post = (url,data) => {
    return request_8088({
        url: a+'/vehicle/'+url,
        // url: '/api/vehicle/'+url,
        method: 'post',
        data:qs.stringify(data)

    });
};
export const User_post = (url,data) => {
    return request_8088({
        url: a+'/user/'+url,
        // url: '/api/user/'+url,
        method: 'post',
        data:qs.stringify(data)

    });
};

export const Control_post = (url,data) => {
    return request_9292({
        url: a+'/control/'+url,
        // url: '/api/control/'+url,
        method: 'post',
        data:qs.stringify(data)

    });
};
export const Control_get = url => {
    return request_8088({
        url: a+'/vehicle/'+url,
        // url: '/api/vehicle/'+url,
        method: 'get',

    });
};
// export const fetchAlarmData = query => {
//     return request_8088({
//         url: './alarm_table.json',
//         method: 'get',
//         params: query
//     });
// };


export const stringToHexArray= data=>{
    let a=''
    for(let i=1;i<data.length-1;i++){
        // console.log(data[i])
        a=a+data[i]
    }
    // console.log('转换=========')
    // console.log(data)
    // console.log(a)
    // let shuchu1=[]
    let shuchu=a.split(',');
    // for(let j=0;j<shuchu.length;j++){
    //     shuchu[j]=shuchu[j].toString(16);
    // }
    for (let i=0;i<shuchu.length;i++){
        shuchu[i]=parseInt(shuchu[i])
    }
    return shuchu
}

export const dataAnalysis=data=>{
    let afterParsingData={}
    for(let a=6;a<data.length;a++){
        if (data[a]===1){
            let vehicleData=[]
            for(let index=1;index<=24;index++)
            {
                vehicleData.push(data[a+index])
            }
            if (vehicleData[20]===-1&&vehicleData[21]===-2){
                afterParsingData['instantaneousSpeed']='异常'
            }
            else if (vehicleData[20]===-1&&vehicleData[21]===-1){
                afterParsingData['instantaneousSpeed']='无效'
            }else {
                afterParsingData['instantaneousSpeed']=vehicleData[20]*256+vehicleData[21]
            }
            if (vehicleData[1]===1){
                afterParsingData['taskStatus']='工作中'
            }else if (vehicleData[1]===2){
                afterParsingData['taskStatus']='待命中'
            }
            else if (vehicleData[1]===3){
                afterParsingData['taskStatus']='空闲中'
            }
            else if (vehicleData[1]===-2){
                afterParsingData['taskStatus']='异常'
            }
            else if (vehicleData[1]===-1){
                afterParsingData['taskStatus']='无效'
            }
            else {
                afterParsingData['taskStatus']='其他'
            }
            afterParsingData['vehicleData']=vehicleData
            a=a+24

        }else if (data[a]===2){

            for(let index=0;index<data[a+1];index++){
                let motorData=[]
                for (let k=1;k<=12;k++){
                    motorData.push(data[a+(index*12+k)])
                }
                afterParsingData['motorData'+index]=motorData
            }
            a=a+(data[a+1]*12)
        }else if (data[a]===3){
            let batteryData=[]
            for (let index=1;index<=6;index++){
              batteryData.push(data[a+index])
            }

            if(batteryData[1]===-2){
                afterParsingData['batteryLevel']='异常'
            }else if (batteryData[1]===-1){
                afterParsingData['batteryLevel']='无效'
            }else {
                afterParsingData['batteryLevel']=batteryData[1]
            }
            afterParsingData['batteryData']=batteryData
            a=a+6
        }else if (data[a]===4){
            let outdoorPositioning=[]
            for (let index=1;index<=13;index++){
                outdoorPositioning.push(data[a+index])
            }
            afterParsingData['outdoorPositioning']=outdoorPositioning
            a=a+13
        }else if (data[a]===5){
            let indoorPositioning=[]
            for (let index=1;index<=11;index++){
                indoorPositioning.push(data[a+index])
            }
            afterParsingData['indoorPositioningStatusBit']=parseInt(indoorPositioning[0].toString(2))
            afterParsingData['indoorPositioning_x']=indoorPositioning[1]*100+indoorPositioning[2]+indoorPositioning[3]*0.01+indoorPositioning[4]*0.0001+indoorPositioning[5]*0.000001
            afterParsingData['indoorPositioning_y']=indoorPositioning[6]*100+indoorPositioning[7]+indoorPositioning[8]*0.01+indoorPositioning[9]*0.0001+indoorPositioning[10]*0.000001
            a=a+11
        }else if (data[a]===6){
            let alertData=[]
            for (let index=1;index<=5;index++){
                alertData.push(data[a+index])
            }
            if (alertData[0]===0){
                afterParsingData['malfunction']='无故障'
            }else if(alertData[0]===1){
                afterParsingData['malfunction']='一级故障'
            }else if(alertData[0]===2){
                afterParsingData['malfunction']='二级故障'
            }else if(alertData[0]===3){
                afterParsingData['malfunction']='三级故障'
            }else {
                afterParsingData['malfunction']='未知故障'
            }

            let alarmMarker=parseInt((alertData[1]*16777216+alertData[2]*65536+alertData[3]*256+alertData[4]).toString(2))
            afterParsingData['alarmMarker']=alarmMarker
            let num=alarmMarker

            // console.log(alertData[1]*16777216+alertData[2]*65536+alertData[3]*256+alertData[4])
            afterParsingData['alertData']=alertData
            let biaozhiwei=[]
            while(num>=1){
                biaozhiwei.push(parseInt(num%10))
                num=parseInt(num/10)
            }
            let alarmReason=[]
            // console.log(biaozhiwei)
            for (let i=0;i<biaozhiwei.length;i++){
                if (biaozhiwei[i]===1){
                   if (i===0){
                       alarmReason.push('温度差异报警')
                   } else if (i===1){
                       alarmReason.push('电池高温报警')
                   }else if (i===2){
                       alarmReason.push('电量过低报警')
                   }else if (i===3){
                       alarmReason.push('电池过压报警')
                   }else if (i===4){
                       alarmReason.push('电池欠压报警')
                   }else {
                       alarmReason.push('未知原因报警')
                   }
                }
            }
            afterParsingData['alarmReason']=alarmReason
            // console.log(biaozhiwei)
            a=a+5
        }else {
            console.log(a+'位为未定义数据')
        }

    }
    return afterParsingData
}

