<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 车辆调度
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      <div class="container">
        <div class="handle-box">
          <div style="position: relative">
            <div v-for="dataVehicle in newData" style="z-index:999" class="vehiclePosition" :style="{  left:dataVehicle.indoorPositioning_x,top:dataVehicle.indoorPositioning_y, background:dataVehicle.color }" v-if="dataVehicle.loginState==='在线'"></div>
            <img src="../../assets/img/ditu.png" width="100%">

          </div>

        <el-table
                :data="newData"
                :header-cell-style="{'text-align':'center'}"
                :row-class-name="rowClassName"
                :cell-style="{'text-align':'center'}"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                style="width:100%"
                empty-text="暂无车辆数据"
        >
          <el-table-column v-for="fruit in formThead"
                           :key="fruit.prop"
                           :label="fruit.label"


          >
            <template slot-scope="scope">
                            <span class="col-cont" style="color:black" v-html=" showDate(scope.row[fruit.prop])"
                                  v-if="scope.row.malfunction=='无故障'"></span>
              <span class="col-cont" style="color:orange" v-html=" showDate(scope.row[fruit.prop])"
                    v-else-if="scope.row.malfunction=='----'"></span>
              <span class="col-cont" style="color:red" v-html=" showDate(scope.row[fruit.prop])"
                    v-else></span>
              <!--                            <span class="col-cont"  v-html=" showDate(scope.row[fruit.prop])"  ></span>-->
              <el-button class="col-cont" @click="detailsExplain(scope.row.index )"
                         v-if="scope.row.malfunction!='无故障'&&scope.row.malfunction!='----'&&fruit.prop==='malfunction'">
                详情
              </el-button>

            </template>

          </el-table-column>
          <el-table-column label="车辆颜色" align="center" >
            <template slot-scope="scope">
              <el-color-picker show-alpha :value="scope.row['color']" @active-change="activeChange(scope.row.index,$event)"  ></el-color-picker>
            </template>
          </el-table-column>





          <el-table-column label="车辆调度" align="center">
            <template slot-scope="scope">
              <el-button
                      @click="dispatchRow(scope.row.index)"
              >调度
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title=位置调度 :visible.sync="dialogFormVisible">
          <template>
            <div style="height: 30px" ><strong>VIN：</strong>{{diaoduTitle}}</div>
            <div style="height: 30px" ><strong>地点：</strong></div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="A"></el-checkbox>
              <el-checkbox label="B"></el-checkbox>
              <el-checkbox label="C"></el-checkbox>
              <el-checkbox label="D"></el-checkbox>
              <el-checkbox label="E"></el-checkbox>
              <el-checkbox label="F"></el-checkbox>
            </el-checkbox-group>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="checkSend()" :disabled="checkList.length===0" >确 定</el-button>
            <!--                        <el-button type="primary" @click="checkSend()" v-else>确 定</el-button>-->
          </div>
        </el-dialog>






        </div>
      </div>
    </div>
</template>

<script>
    import { Vehicle_get, stringToHexArray, dataAnalysis ,Control_post, Vehicle_post} from '../../api/index';
    import { Loading } from 'element-ui';

    const fields = [
        { label: 'VIN', prop: 'vin' },
        { label: '在线状态', prop: 'loginState' },
        { label: '任务状态', prop: 'taskStatus' },
        { label: '电量', prop: 'batteryLevel' },
        { label: '故障状态', prop: 'malfunction' },

        // { label: '故障原因', prop: 'alarmReason' },


    ];
    export default {
        name: 'vehicledispatch',
        data() {
            return {
                test:'100px',
                checkList: [],
                tableData: [],
                formThead: fields,
                loginDataKey: [],
                allDataList: [],
                vehicleStateKey: [],
                vehicleStateList: [],
                parsingData: {},
                listData: [],
                newData:[],
                timer: null,
                dialogFormVisible:null,
                dispatchRowget:null,
                sendCheckSite:'',
                sendCheckList:{},
                diaoduTitle:'',
                timer_control:null,
                pollFlag:1,
                isOvertime:0,
                loading:false,
                loadingInstance1:null,
                disabledFlag:true,
              colorGet:[],
            };
        },
//pollFlag 轮询返回标志位 isOvertime是否超时
        mounted() {
            this.getData();

            this.timer = setInterval(() => {
                this.getData()
            }, 1000 * 1);

        },
        created() {
            // this.getData()
            // this.beforeDestroy()
        },
        methods: {
          activeChange(row,value){

            const reg = /[0-9]\d+/g
            const getArr = value.match(reg)
            let hexStr = '#'+((getArr[0] << 16) | (getArr[1]  << 8) | getArr[2] ).toString(16);
            console.log(hexStr)
            Vehicle_post('updateColorByVin'+'?times='+new Date().getTime(),{vin:this.newData[row].vin,color: hexStr}).then(res=>{
              console.log(res)
            })

    },
            dispatchRow(row){
                this.dialogFormVisible=true
                this.dispatchRowget=row
                this.diaoduTitle=this.newData[this.dispatchRowget].vin

            },
            checkSend(){
                this.sendCheckSite=''
                this.dialogFormVisible = false
                // console.log(this.newData[this.dispatchRowget].vin)
                // console.log(this.checkList)
                for(let i=0;i<this.checkList.length;i++){
                    this.sendCheckSite=this.sendCheckSite+this.checkList[i]
                }
                this.sendCheckList={vin:this.newData[this.dispatchRowget].vin,position:this.sendCheckSite}
                // console.log(this.sendCheckList);
                Vehicle_post('position'+'?times='+new Date().getTime(),this.sendCheckList).then(res1=>{
                    console.log(res1)
                    this.checkList=[];
                    this.pollFlag=1;
                    this.isOvertime=0;
                    this.pollingCallback()
                })
            },
            showDate(val) {
                val = val + '';
                if (val.indexOf(this.keyword) !== -1 && this.keyword !== '') {
                    return val.replace(this.keyword, '<font color="#409EFF">' + this.keyword + '</font>');
                } else {
                    return val;
                }
            },
            // onRowClick (row, event, column) {
            //     this.currentRowIndex = row.index
            // },
            rowClassName({ row, rowIndex }) {
                //把每一行的索引放进row
                row.index = rowIndex;
                // console.log(row);
            },
            detailsExplain(row) {
                if (this.listData[row].alarmReason.length > 0) {
                    this.$alert(this.listData[row].alarmReason, '故障详情', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                } else {
                    this.$alert('故障原因未知', '故障详情', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                }

            },
            //轮询回调函数
            pollingCallback(){


                    this.timer_control = setInterval(() => {
                        if (this.pollFlag===1&&this.isOvertime<=4){

                            Vehicle_post('rePosition'+'?times='+new Date().getTime(),{vin:this.newData[this.dispatchRowget].vin}).then(res=>{
                                if (res.data==='nothing'){
                                    this.isOvertime=this.isOvertime+1
                                     this.loadingInstance1 = Loading.service(
                                         { fullscreen: true,
                                             text: '任务下发中',
                                         });
                                }
                                else {
                                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        this.loadingInstance1.close();
                                    });
                                    this.pollFlag=0;
                                    this.isOvertime=0;
                                    if (res.data==='[1]'){
                                        this.$alert('指令接收成功', '指令接受情况', {
                                            confirmButtonText: '确定',
                                            callback: action => {

                                            }
                                        });



                                    }else {
                                        this.$alert('接受指令失败', '指令接受情况', {
                                            confirmButtonText: '确定',
                                            callback: action => {

                                            }
                                        });
                                    }
                                    clearInterval(this.timer_control);
                                    this.timer_control = null;

                                }

                            })
                        }else {
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                this.loadingInstance1.close();
                            });
                            clearInterval(this.timer_control);
                            this.timer_control = null;
                            this.$alert('指令请求超时', '指令接受情况', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });


                        }
                    }, 1000 * 1);


            },
            getData() {
                // this.tableData = [];
                // this.loginDataKey = [];
                this.allDataList = [];
                // this.vehicleStateKey = [];
                // this.vehicleStateList = [];
                this.listData = [];
                Vehicle_get('selectAllState'+'?times='+new Date().getTime()).then(res => {
                    // console.log(res);
                    // this.tableData = res.data;
                    console.log('小车状态---------')
                    console.log(res.data);
                    this.vehicleStateList = res.data;
                    this.vehicleStateKey = Object.keys(this.vehicleStateList);


                    Vehicle_get('selectAllLogin'+'?times='+new Date().getTime()).then(res => {
                        // console.log(res);
                        // this.tableData = res.data;
                        // console.log('查询已登入---------')
                        // console.log(res.data);
                        this.loginDataKey = Object.keys(res.data);
                        for (let i = 0; i < this.loginDataKey.length; i++) {
                            this.allDataList.push({
                                vin: this.loginDataKey[i],
                                loginState: res.data[this.loginDataKey[i]],
                                vehicleState: ''
                            });
                            // console.log(this.loginDataList[i])
                        }

                        // console.log(res.data['WEICHAIW302000477'])

                        for (let j = 0; j < this.allDataList.length; j++) {
                            for (let k = 0; k < this.vehicleStateKey.length; k++) {
                                if (this.allDataList[j].vin === this.vehicleStateKey[k]) {
                                    this.allDataList[j].vehicleState = stringToHexArray(this.vehicleStateList[this.vehicleStateKey[k]]);
                                }
                            }
                        }
                        // console.log('综合查看--------');
                        for (let k = 0; k < this.allDataList.length; k++) {
                            let Array = dataAnalysis(this.allDataList[k].vehicleState);
                            for (let key in Array) {
                                this.allDataList[k][key] = Array[key];
                            }
                        }

// console.log( this.allDataList)
                      //添加车辆颜色
                      Vehicle_get('selectAllVehicle'+'?times='+new Date().getTime()).then(res=>{
                        this.colorGet=[]
                        for (let i=0;i<this.allDataList.length;i++){
                          for (let j=0;j<res.data.length;j++){
                            if (this.allDataList[i].vin===res.data[j].vin){
                              // this.listData[i]['color_']='a'+res.data[j].color
                              this.colorGet.push(res.data[j].color)
                            }
                          }
                        }





                        // console.log(this.allDataList[0].vehicleState[2])
                        // console.log(this.allDataList);
                        for (let index = 0; index < this.allDataList.length; index++) {
                          // console.log('室内x坐标——————————————————————————-')
                          this.allDataList[index].indoorPositioning_x=this.allDataList[index].indoorPositioning_x+'px'
                          // console.log(this.allDataList[index].indoorPositioning_x)
                          // console.log('室内y坐标——————————————————————————-')
                          this.allDataList[index].indoorPositioning_y=this.allDataList[index].indoorPositioning_y+'px'
                          // console.log(this.allDataList[index].indoorPositioning_y)
                          if (this.allDataList[index].loginState === 60) {
                            this.allDataList[index].loginState = '离线';
                          } else if (this.allDataList[index].loginState >= 0 && this.allDataList[index].loginState <= 59) {
                            this.allDataList[index].loginState = '在线';
                          }
                          this.listData.push({
                            //VIN码 在线状态 剩余电量  故障状态 报警原因 任务状态
                            vin: this.allDataList[index].vin,
                            loginState: this.allDataList[index].loginState,
                            batteryLevel: this.allDataList[index].batteryLevel,
                            malfunction: this.allDataList[index].malfunction,
                            alarmReason: this.allDataList[index].alarmReason,
                            taskStatus:this.allDataList[index].taskStatus,
                            indoorPositioning_y:this.allDataList[index].indoorPositioning_y,
                            indoorPositioning_x:this.allDataList[index].indoorPositioning_x,
                            color:this.colorGet[index],

                          });
                        }








                        // console.log(this.listData)
                        for (let i = 0; i < this.listData.length; i++) {
                          for (let key1 in this.listData[i]) {
                            // console.log(this.listData[i][key1])
                            if (this.listData[i][key1] === undefined) {
                              this.listData[i][key1] = '----';
                            }

                          }
                        }
                        // this.parsingData= dataAnalysis(this.allDataList[0].vehicleState)
                        // console.log(this.parsingData)
                        let  malfunction_num=0
                        let length1=this.listData.length-1
//把未接收到数据的内容放到最后
                        for(let a=this.listData.length-1;a>0;a--){
                          for (let key1 in this.listData[a]) {
                            // console.log(this.listData[i][key1])
                            if (this.listData[a][key1] ==='----') {
                              let object=this.listData[a]
                              this.listData[a]=this.listData[length1]
                              this.listData[length1]=object
                              length1=length1-1
                              break
                            }

                          }

                        }

                        for(let a=0;a<this.listData.length;a++){
                          for(let b=a;b<this.listData.length;b++){
                            if (this.listData[b].malfunction!='无故障'&&this.listData[b].malfunction!='----'){
                              let object=this.listData[b]
                              this.listData[b]=this.listData[a]
                              this.listData[a]=object
                              malfunction_num=malfunction_num+1
                              break
                            }
                          }
                        }
                        for(let a=malfunction_num;a<this.listData.length;a++){
                          for(let b=a;b<this.listData.length;b++){
                            if (this.listData[b].loginState==='在线'){
                              let object=this.listData[b]
                              this.listData[b]=this.listData[a]
                              this.listData[a]=object
                              break
                            }
                          }
                        }



                        this.newData=this.listData









                      });




                    });
                });


            },



        },

        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
</script>

<style scoped>
.vehiclePosition{
  width: 10px;
  height: 10px;
  position: absolute;
}

</style>