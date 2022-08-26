<!-- 高德地图坐标拾取组件 测试 -->

<template>
        <div class="vueAmap">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
            </el-amap-search-box>
            <el-amap  vid="amapEdit" :zoom="amap.zoom" :center="amap.center" :plugin="amap.plugin"
                :events="amap.events">
                <el-amap-marker v-for="(marker, index) in amap.markers" :key="'marker' + index"
                    :position="marker.position">
                </el-amap-marker>
                <el-amap-text v-for="(marker, index) in amap.markers" :key="'text' + index" :text="marker.text"
                    :offset="marker.offset" :position="marker.position"></el-amap-text>
            </el-amap>
        </div>
</template>

<script>
export default {
    props: {
    'Lng': {
            type: Number,
            required: true,
            default: 121.262448
    },
    "Lat": {
        type: Number,
        required: true,
        default: 28.646985
    }
    },
    data() {
        const vm = this;
        return {
            showDialog: true,
            // form对象
            dataForm:  {
                lat: "28.646985",
                lon: "121.262448",
                orgAddr: "初始地点"
            },
            // 地图搜索对象
            searchOption: {
                city: "",
                citylimit: true
            },
            // 地图对象
            amap: {
                zoom: 16,
                center: [121.262448, 28.646985],
                events: {
                    click(e) {
                        let { lng, lat } = e.lnglat;
                        self.lng = lng;
                        self.lat = lat;
                        // 这里通过高德 SDK 完成。
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        geocoder.getAddress([lng, lat], function (status, result) {
                            if (status === "complete" && result.info === "OK") {
                                if (result && result.regeocode) {
                                    vm.dataForm.orgAddr = result.regeocode.formattedAddress;
                                    vm.dataForm.lat = lat ? lat.toString() : "";
                                    vm.dataForm.lon = lng ? lng.toString() : "";
                                    vm.amap.markers = [];
                                    const obj = {
                                        position: [lng, lat],
                                        text: result.regeocode.formattedAddress,
                                        offset: [0, 30]
                                    };
                                    vm.amap.markers.push(obj);
                                }
                            }
                        });
                    }
                },
                plugin: ["ToolBar"],
                markers: [
                    {
                        position: [106.893565, 27.644778],
                        text: "原地点",
                        offset: [0, 30]
                    }
                ]
            }
        };
    },
    created(){
        // this.getFormData();
        console.log("vm",this);
    },
    methods: {
        getFormData() {
            return {
                lat: String(this.Lat),
                lon: String(this.Lng),
                orgAddr: "初始"
            };
        },
        // 地图搜索回调
        onSearchResult(pois) {
            const vm = this;
            vm.amap.markers = [];
            let latSum = 0;
            let lngSum = 0;
            if (pois.length > 0) {
                pois.forEach((poi, index) => {
                    let { lng, lat } = poi;
                    if (index === 0) {
                        lngSum = lng;
                        latSum = lat;
                        const obj = {
                            position: [poi.lng, poi.lat],
                            text: poi.name,
                            offset: [0, 30]
                        };
                        vm.amap.markers.push(obj);
                        vm.dataForm.orgAddr = poi.name;
                        vm.dataForm.lat = poi.lat ? poi.lat.toString() : "";
                        vm.dataForm.lon = poi.lng ? poi.lng.toString() : "";
                    }
                });
                vm.amap.center = [lngSum, latSum];
            }
        },
        // 打开弹窗
        open(data) {
            const vm = this;
            vm.dataForm = getFormData();
            if (data) {
                console.log("初始化地图",data);
                vm.amap.markers = [
                    {
                        position: [data.lon, data.lat],
                        text: data.addr,
                        offset: [0, 30]
                    }
                ];
                vm.amap.center = [data.lon, data.lat];
                /*vm.dataForm.lon = data.lon;
                vm.dataForm.lat = data.lat;
                vm.dataForm.orgAddr = data.addr;
                vm.amap.center = [data.lon, data.lat];*/
            }
            vm.showDialog = true;
        },
        // 关闭弹窗
        handleClose() {
            const vm = this;
            vm.showDialog = false;
            vm.dataForm = getFormData();
            vm.amap.markers = [];
            const obj = {
                position: [vm.dataForm.lon, vm.dataForm.lat],
                text: vm.dataForm.orgAddr,
                offset: [0, 30]
            };
            vm.amap.markers.push(obj);
            vm.amap.center = [vm.dataForm.lon, vm.dataForm.lat];
            //vm.$refs.dataForm.resetFields();
        },
        // 提交方法
        submit() {
            const vm = this;
            console.log("坐标拾取",this.dataForm);
            // vm.$emit("map", vm.amap.markers);
            // vm.handleClose();
        }
    },
    computed: {

    }
};
</script>

<style lang="scss">
.vueAmap {
    width: 100%;
    height: 550px;
    position: relative;
    margin: 0;

    .search-box {
    position: absolute;
    right: 20px !important;
    top: 30px !important;
}
}
</style>
