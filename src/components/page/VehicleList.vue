<template>


    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 车辆信息管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd('form')"

                >新增车辆
                </el-button>
                <el-input v-model="keyword" placeholder="VIN码/设备编码" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearchList()">搜索</el-button>
            </div>

            <div v-if="searchData.length>0">
                <el-table
                        :data="searchData"
                        :header-cell-style="{'text-align':'center'}"
                        :cell-style="{'text-align':'center'}"
                        border
                        style="width: 100%;"
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                        empty-text="暂无车辆数据"
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
                            <span class="col-cont" style="color:gray" v-html=" showDate(scope.row[fruit.prop])" v-if="scope.row.isLogin=='未登入'"></span>
                            <span class="col-cont" style="color:green" v-html=" showDate(scope.row[fruit.prop])" v-else-if="scope.row.isLogin=='已登入'"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleEdit(scope.$index, scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handleDelete(scope.$index, scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" >
                    <el-pagination
                            background

                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.currentPage"
                            :page-size="query.pageSize"
                            :total="searchData.length"
                            :pager-count="7"
                            @current-change="handlePageChange"
                            @size-change="handleSizeChange"
                            :page-sizes="[7,15, 30, 50, 100]"
                    >

                    </el-pagination>
                </div>
            </div>
            <div v-else>
                <el-table
                        :data="tableDataEnd"
                        :header-cell-style="{'text-align':'center'}"
                        :cell-style="{'text-align':'center'}"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                        empty-text="暂无车辆数据"
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
                            <span class="col-cont" style="color:gray" v-html=" showDate(scope.row[fruit.prop])" v-if="scope.row.isLogin=='未登入'"></span>
                            <span class="col-cont" style="color:green" v-html=" showDate(scope.row[fruit.prop])" v-else-if="scope.row.isLogin=='已登入'"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleEdit(scope.$index, scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handleDelete(scope.$index, scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" >
                    <el-pagination
                            background

                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.currentPage"
                            :page-size="query.pageSize"
                            :total="tableData.length"
                            :pager-count="7"
                            @current-change="handlePageChange"
                            @size-change="handleSizeChange"
                            :page-sizes="[7,15, 30, 50, 100]"
                    >

                    </el-pagination>
                </div>
            </div>


        </div>

        <!--        编辑弹出框-->
        <!--        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
        <!--            <el-form ref="form" :model="form" label-width="70px">-->
        <!--                <el-form-item label="用户名">-->
        <!--                    <el-input v-model="form.name"></el-input>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="地址">-->
        <!--                    <el-input v-model="form.address"></el-input>-->
        <!--                </el-form-item>-->
        <!--            </el-form>-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="editVisible = false">取 消</el-button>-->
        <!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
        <!--            </span>-->
        <!--        </el-dialog>-->

        <el-dialog
                :title="isEdit?'编辑用户':'添加用户'"
                :visible.sync="editVisible"
                :close-on-click-modal="false"
                @close="editVis"
                width="30%">
            <el-form
                    :model="form"
                    ref="form"
                    :rules="rulesAddUser"
                    label-width="120px" size="small">
                <el-form-item label="设备编码：" prop="device">

                    <div  style="width: 170px"   v-if="isEdit>0"> &emsp;{{ form.device}}</div>
                    <el-input  style="width: 170px;" v-model="form.device" v-else></el-input>
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                    <el-input  v-model="form.vin" style="width: 170px"></el-input>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button  size="small"  @click='editVis'>取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="small">确 定</el-button>
      </span>
        </el-dialog>


    </div>


</template>

<script>
    //引入接口
    import { Vehicle_get } from '../../api/index';
    import { Vehicle_post } from '../../api/index';


//表头显示的内容
    const fields = [
        { label: 'VIN', prop: 'vin' },
        { label: '设备编码', prop: 'device' },
        { label: '登入状态', prop: 'isLogin' },
        { label: '创建时间', prop: 'createtime' }
    ];

    export default {

        name: 'VehicleList',
        inject:['reload'],
        data() {
            return {
                query: {
                    vin: '',
                    device: '',
                    pageIndex: 1,
                    pageSize: 7,
                    currentPage: 1
                },
                permission_text: [
                    { value: '0', label: '管理员' },
                    { value: '1', label: '普通用户' }

                ],
                tableData: [],
                tableDataEnd: [],
                multipleSelection: [],
                delList: [],
                addList: [],
                dele_list:{},
                edit_data:{},
                add_list:{},
                vin_list:[],
                keyword: '',
                old_vin:'',
                new_vin:'',
                old_device:'',
                editVisible: false,
                pageTotal: 0,
                searchData: [],
                form: {
                    vin: '',
                    device: '',
                },
                url: 'asset',
                key: 1, // table key
                formThead: fields, // 默认表头 Default header
                idx: -1,
                id: -1,
                length1: 0,
                isEdit: false,
// 验证规则
                rulesAddUser: {
                    vin: [
                        { required: true, message: '请输入VIN', trigger: 'blur' }
                    ],
                    device: [
                        { required: true, message: '请输入设备编码', trigger: 'blur' }
                    ],

                }


            };
        },
        created() {
            this.getData();
            this.updateData();
        },
        methods: {
            editVis(){
                //改变编辑页面的状态位
                this.editVisible = false
                this.getData()
                this.handleSearchList()
                this.updateData()
            },
            //关键字高亮显示
            showDate(val) {
                val = val + '';
                if (val.indexOf(this.keyword) !== -1 && this.keyword !== '') {
                    return val.replace(this.keyword, '<font color="#409EFF">' + this.keyword + '</font>');
                } else {
                    return val;
                }
            },
            // currentChangePage(list) {
            //     let from = (this.query.currentPage - 1) * this.query.pageSize;
            //     let to = this.query.currentPage * this.query.pageSize;
            //     this.tableDataEnd = [];
            //     for (; from < to; from++) {
            //         if (list[from]) {
            //             this.tableDataEnd.push(list[from]);
            //         }
            //     }},
            //每页显示的数据内容
            updateData() {



                const begin = (this.query.currentPage - 1) * this.query.pageSize;
                const end = this.query.currentPage * this.query.pageSize;
                // console.log('begin' + begin);

                this.tableDataEnd = this.tableData.slice(begin, end);
                // console.log('end' + end);
                // console.log('tableData' + this.tableData);
                // console.log('tableDataEnd' + this.tableDataEnd);

            },
            //设置表格起始页面和每页显示数据数量
            resetSize() {
                this.query.currentPage = 1;
                this.query.pageSize = 7;
            },
            //改变每页显示数据的数量
            handleSizeChange(val) {
                this.resetSize();
                this.query.pageSize = val;
                console.log(`每页 ${val} 条`);
                this.updateData();
            },
            //根据关键字搜索，并显示搜索内容
            handleSearchList() {
                this.getData()
                this.searchData = [];
                console.log(this.tableData);
                for (let i = 0; i < this.tableData.length; i++) {
                    if ((this.tableData[i].vin.indexOf(this.keyword) >= 0||this.tableData[i].device.indexOf(this.keyword) >= 0) && (this.keyword !== '')) {
                        this.searchData.push(this.tableData[i]);
                    }
                }
                console.log(this.searchData);

            },

            // 通过接口获取数据，如果登入状态为0，显示未登入，如果登入状态为1，显示已登入
            getData() {
                Vehicle_get('selectAllVehicle'+'?times='+new Date().getTime()).then(res => {
                    // // console.log(res);
                    // this.tableData = res.list;
                    // console.log(res.list);
                    // this.pageTotal = res.pageTotal || 50;
                    // // console.log(res.pageTotal);
                    // this.updateData();
                    for(let i=0;i<res.data.length;i++){
                        this.vin_list[i]=res.data[i]
                    }
                    console.log('---------------------------------')
                    // console.log(res.data)
                    this.tableData = res.data;
                    for(let j=0;j<res.data.length;j++){
                        if (res.data[j].isLogin==='0'){
                            this.tableData[j].isLogin='未登入'
                        }
                        if (res.data[j].isLogin==='1'){
                            this.tableData[j].isLogin='已登入'
                        }
                    }

                    for(let i=0;i<this.tableData.length;i++){
                        for(let j=i;j<this.tableData.length;j++){
                            if (this.tableData[j].isLogin==='已登入'){
                                let object=this.tableData[j];
                                this.tableData[j]=this.tableData[i];
                                this.tableData[i]=object
                            }
                        }
                    }

                    console.log(this.tableData)
                    this.pageTotal = res.pageTotal || 50;
                    // console.log(res.pageTotal);
                    this.updateData();
                }).catch((e) => {});

            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                console.log(this.$set(this.query, 'pageIndex', 1));
                this.updateData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                // console.log(this.searchData[index]);
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'

                }).then(() => {
                        if (this.keyword !== '') {
                            this.$message.success('删除成功');

                            for (let i = 0; i < this.tableData.length; i++) {
                                if (this.tableData[i].vin=== this.searchData[index].vin) {
                                    this.dele_list={vin:this.searchData[index].vin}
                                    Vehicle_post('deleteVehicle',this.dele_list).then(res => {
                                        this.reload()
                                        this.getData();
                                        this.updateData();
                                        // console.log(res)
                                        // this.reload()

                                    })

                                    break;
                                }
                            }
                            // this.tableData.splice(index, 1);
                        } else {
                            this.$message.success('删除成功');
                            this.dele_list={vin:this.tableData[index].vin}
                            console.log(this.dele_list)
                            Vehicle_post('deleteVehicle'+'?times='+new Date().getTime(),this.dele_list).then(res => {
                                this.getData();
                                this.updateData();
                                console.log(res)
                            }).catch((e) => {
                            }).then(res=>{
                                this.reload()
                            });


                        }

                    })


            },
            // 多选操作
            handleSelectionChange(val) {
                // console.log("handleSelectionChange--",val)
                this.multipleSelection = val;
            },
            delAllSelection() {
                if (this.multipleSelection.length === 0) {
                    this.$confirm('您未选中任何数据', '提示', {
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            this.$message.success('删除成功');
                            // this.tableData.splice(index, 1);

                            let length = this.multipleSelection.length;

                            // this.delList = this.delList.concat(this.multipleSelection);
                            this.delList = this.multipleSelection;

                            for (let i = 0; i < length; i++) {
                                for (let j = 0; j < this.tableData.length; j++) {
                                    if (this.tableData[j].name === this.delList[i].name) {
                                        this.tableData.splice(j, 1);
                                        this.updateData();
                                    }
                                }
                            }
                            this.multipleSelection = [];
                            this.delList = [];


                        })
                        .catch(() => {
                        });

                }


                //


                // const length = this.multipleSelection.length;
                // this.delList = this.delList.concat(this.multipleSelection);
                //
                // for (let i = 0; i < length; i++) {
                //     for (let j = 0; j <this.tableData.length ; j++) {
                //         if (this.tableData[j].name===this.delList[i].name)
                //             this.tableData.splice(j,1)
                //     }
                // };
                // this.multipleSelection = [];
            },

            // 编辑操作

            // 保存编辑
            saveEdit() {
                // this.editVisible = false;
                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                // this.$set(this.tableData, this.idx, this.form);

//判断输入的内容是否满足条件
                if(this.$refs.form.fields[0].fieldValue==null||this.$refs.form.fields[1].fieldValue==null)
                    {

                    this.$alert('输入不能为空', '错误提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    })
                }
                else if (this.$refs.form.fields[1].fieldValue.length!=17||this.$refs.form.fields[0].fieldValue!=10){

                     if (this.$refs.form.fields[0].fieldValue.length!=10){
                        this.$alert('设备编码长度应为10个字符', '错误提示', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        })
                    }else if (this.$refs.form.fields[1].fieldValue.length!=17){
                         this.$alert('VIN码长度应为17个字符', '错误提示', {
                             confirmButtonText: '确定',
                             callback: action => {

                             }
                         })
                     }

                else {
                        this.$confirm('是否要确认?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            //判断是新增还是编辑
                            if (this.isEdit) {
                                this.editVisible = false;
                                // console.log(this.$refs.form.fields.length);
                                //得到最新的设备号和VIN
                                this.old_device=this.$refs.form.fields[0].fieldValue
                                this.new_vin=this.$refs.form.fields[1].fieldValue
                                this.edit_data={vin:this.new_vin,device:this.old_device,oldVin:this.old_vin}
                                console.log(this.edit_data);
                                Vehicle_post('updateVinByDevice'+'?times='+new Date().getTime(),this.edit_data).then(res => {
                                    this.getData();
                                }).catch((e) => {});



                                // console.log(add);
                                this.updateData();

                            } else
                            {
                                // createAdmin(this.admin).then(response => {
                                //     this.$message({
                                //         message: '添加成功！',
                                //         type: 'success'
                                //     });
                                this.editVisible = false;
                                this.add_list = {
                                    vin: this.$refs.form.fields[1].fieldValue,
                                    device: this.$refs.form.fields[0].fieldValue
                                }
                                // console.log(this.add_list)
                                Vehicle_post('insertVehicle'+'?times='+new Date().getTime(), this.add_list).then(res => {
                                    this.getData();
                                    this.updateData();
                                    console.log(res)
                                }).catch((e) => {
                                }).then(res=>{
                                    this.reload()
                                });

                            }


                            // console.log(add);


                            //
                            // });


                        });
                    }
                }

            },
            //编辑按钮
            handleEdit(index, row) {
                // this.handle_old_vin=this.$refs.form.fields[0].fieldValue,
                // setTimeout(function (){
                //     console.log(this.$refs);
                // }, 1000);
                this.idx = index;
                this.old_vin=this.vin_list[index].vin
                this.form = row;

                this.editVisible = true;
                this.isEdit = true;


            },
            // 分页导航
            handlePageChange(val) {
                // this.$set(this.query, 'pageIndex', val);
                // this.getData();
                this.query.currentPage = val;
                // console.log(`当前页: ${val}`);
                this.updateData();
            },
            //新增按钮
            handleAdd(form) {

                this.$nextTick(() => {
                    this.form = {};
                    if (this.$refs[form] !== undefined) {
                        this.$refs[form].resetFields();
                    }


                });
                this.editVisible = true;
                this.isEdit = false;
                console.log(form)
                this.updateData();
            },
            close() { // 表单关闭置空字段（不展示的字段是无法置空的）

            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    [v-cloak] {
        display: none !important;
    }

    .filter-container {
        margin-top: 20px;
    }
</style>
