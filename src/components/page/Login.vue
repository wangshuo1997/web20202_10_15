<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">智能物流转运车管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { User_post } from '../../api/index';
export default {
    data: function() {
        return {
            loginData:{},
            param: {
                username: 'admin',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        // submitForm() {
        //     this.$refs.login.validate(valid => {
        //         if (valid) {
        //             this.$message.success('登录成功');
        //             localStorage.setItem('ms_username', this.param.username);
        //             this.$router.push('/');
        //         } else {
        //             this.$message.error('请输入账号和密码');
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // },
        submitForm() {
            this.loginData={username:this.param.username,password:this.param.password}
            User_post('login'+'?times='+new Date().getTime(),this.loginData).then(res=>{
                console.log(res);
                if (res.code){
                    this.$message.error('账号或密码错误');
                                console.log('error submit!!');
                                return false;
                }else {
                    this.$message.success('登录成功');
                                localStorage.setItem('ms_username', this.param.username);
                                this.$router.push('/');
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../assets/img/weichai_logo.jpg);
    background-size: 100% 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>