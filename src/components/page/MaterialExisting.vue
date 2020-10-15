<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">

                <el-button
                        type="primary"
                        icon="el-icon-refresh-right"
                        class="handle-del mr10"
                        @click="getData"

                >订单刷新
                </el-button>
                <el-button
                        type="primary"
                        icon="el-icon-thumb"
                        class="handle-del mr10"
                        @click="dispatchRow"

                >订单派遣
                </el-button>
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
                        empty-text="暂无订单数据，请点击<订单刷新>按钮进行重试"
                >
                    <el-table-column label="ID" width="55" align="center">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="fruit in formThead"
                                     :key="fruit.prop"
                                     :label="fruit.label"
                    >
                        <template slot-scope="scope">
                            <span class="col-cont" v-html=" showDate('----')"
                                  v-if="scope.row[fruit.prop]===undefined"></span>
                            <span class="col-cont" v-html=" showDate(scope.row[fruit.prop])" v-else></span>
                        </template>
                    </el-table-column>

                </el-table>
                <el-dialog title=当前可用AGV车辆 :visible.sync="dialogFormVisible">
                    <el-table
                            :data="vehicleListShow"
                            :header-cell-style="{'text-align':'center'}"
                            :row-class-name="rowClassName"
                            :cell-style="{'text-align':'center'}"
                            border
                            class="table"
                            ref="multipleTable"
                            header-cell-class-name="table-header"
                            style="width:100%"
                            empty-text="暂无可调度车辆"
                    >
                        <el-table-column v-for="fruit in formThead_vehicle"
                                         :key="fruit.prop"
                                         :label="fruit.label"

                        >
                            <template slot-scope="scope">
                            <span class="col-cont"  v-html=" showDate(scope.row[fruit.prop])"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="车辆调度" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        @click="diaodu(scope.row.index)"
                                >调度
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
<!--                    <div slot="footer" class="dialog-footer">-->
<!--                        <el-button @click="dialogFormVisible = false">取 消</el-button>-->
<!--                        <el-button type="primary" @click="dialogFormVisible = false" >确 定</el-button>-->
<!--                        &lt;!&ndash;                        <el-button type="primary" @click="checkSend()" v-else>确 定</el-button>&ndash;&gt;-->
<!--                    </div>-->
                </el-dialog>

            </div>
        </div>

    </div>
</template>

<script>
    import { Control_get, dataAnalysis, stringToHexArray, Vehicle_get ,Vehicle_post} from '../../api/index';


    const fields = [
        { label: '出库先后顺序号', prop: 'ljid' },
        { label: '出库单编号', prop: 'bjid' },
        { label: 'BOM编号', prop: 'wlbomid' },
        { label: '物料ID', prop: 'wlid' },
        { label: '件号', prop: 'jh' },
        { label: '零件名称', prop: 'ljmc' },
        { label: '出库前此ID数量', prop: 'wysl' },
        { label: '出库前现有量', prop: 'yxyl' },
        { label: '出库数量', prop: 'sl' },
        { label: '出库后现有量', prop: 'fsl' },
        { label: '出库后此ID数量', prop: 'wxsl' },
        { label: '出库人', prop: 'ljyr' },
        { label: '出库时间', prop: 'ljytime' },
        { label: '状态', prop: 'state' },
        { label: '存放位置', prop: 'hwmc' },
        { label: '批次', prop: 'pc' },
        // { label: '故障原因', prop: 'alarmReason' },
    ];

    const fields_vehicle = [
        { label: 'VIN', prop: 'vin' },
        { label: '电量', prop: 'batteryLevel' },
    ];
    export default {
        name: 'materialExisting',

        data() {
            return {
                formThead: fields,
                formThead_vehicle: fields_vehicle,
                newData: [],
                listData: [],
                vehicleList: [],
                allDataList:[],
                vehicleStateKey: [],
                vehicleStateList: [],
                loginDataKey: [],
                dialogFormVisible:null,
                vehicleListEnd:[],
                vehicleListShow:[],
                materialData:'',
            };
        },
//pollFlag 轮询返回标志位 isOvertime是否超时
        mounted() {
            // this.getData();

            this.timer = setInterval(() => {
                this.getVehicle()
            }, 1000 * 1);

        },
        created() {

            // this.getData()
            // this.beforeDestroy()
        },
        methods: {
            diaodu(row){

                if (this.materialData.length!==0){
                    let obj={vin:this.vehicleListShow[row].vin,order:this.materialData}

                    Vehicle_post('material'+'?times='+new Date().getTime(),obj).then(res=>{
                        if (res.code===0) {
                            this.$alert('派遣订单成功', '事件详情', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                        } else {
                            this.$alert('派遣订单失败', '事件详情', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                        }
                    })
                }else {
                    this.$alert('派遣订单不能为空，请刷新订单后重试', '事件详情', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                }


            },
            rowClassName({ row, rowIndex }) {
                //把每一行的索引放进row
                row.index = rowIndex;
                // console.log(row);
            },
            dispatchRow(){
                this.dialogFormVisible=true

            },
            rowClassName({ row, rowIndex }) {
                //把每一行的索引放进row
                row.index = rowIndex;
                // console.log(row);
            },
            showDate(val) {
                val = val + '';
                if (val.indexOf(this.keyword) !== -1 && this.keyword !== '') {
                    return val.replace(this.keyword, '<font color="#409EFF">' + this.keyword + '</font>');
                } else {
                    return val;
                }
            },
            getData() {

                this.newData = [];
                Control_get('getMaterial'+'?times='+new Date().getTime()).then(res => {

                    // this.tableData = res.data;
                    // console.log('小车状态---------')
                    // console.log(res.data);
                    this.materialData=res.data
                    console.log(this.materialData);
                    this.newData = JSON.parse(res.data);
                    for (let i = 0; i < this.newData.length; i++) {
                        this.newData[i].wlbomid = 'BOM 000000' + this.newData[i].wlbomid;
                    }
                    console.log(res.data);
                    // this.vehicleStateKey = Object.keys(this.vehicleStateList);
                    //
                    //


                });
            },
            getVehicle() {
                this.allDataList = [];
                // this.vehicleStateKey = [];
                // this.vehicleStateList = [];
                this.listData = [];
                this.vehicleListEnd=[];
                Vehicle_get('selectAllState'+'?times='+new Date().getTime()).then(res => {
                    // console.log(res);
                    // this.tableData = res.data;
                    // console.log('小车状态---------')
                    // console.log(res.data);
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

                        // console.log(this.allDataList[0].vehicleState[2])
                        // console.log(this.allDataList);
                        for (let index = 0; index < this.allDataList.length; index++) {
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
                                taskStatus:this.allDataList[index].taskStatus
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
                       for(let j=0;j<this.listData.length;j++){
                           if (this.listData[j].loginState==='在线'&&this.listData[j].malfunction==='无故障'&&this.listData[j].taskStatus==='待命中'){
                                this.vehicleListEnd.push({
                                    vin:this.listData[j].vin,
                                    batteryLevel: this.listData[j].batteryLevel,
                                })
                           }
                       }
                       this.vehicleListShow=this.vehicleListEnd
                       // console.log(this.vehicleListEnd)




                    });
                });


            },


        },

        //
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
</script>

<style scoped>


</style>