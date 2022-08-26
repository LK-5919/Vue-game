<template>
<div>
    <!-- <el-dialog title="定位地点" :visible.sync="showDialog" width="1200px" :before-close="handleClose"
        :close-on-click-modal="false"> -->
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
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">
                确 定
            </el-button>
            <el-button @click="handleClose">关 闭</el-button>
        </span>
    <!-- </el-dialog> -->
    </div>
</template>

<script>
export default {
    data() {
        const vm = this;
        return {
            showDialog: true,
            // form对象
            dataForm: {
                lat: "27.644778",
                lon: "106.893565",
                orgAddr: "区政府"
            },
            // 地图搜索对象
            searchOption: {
                city: "",
                citylimit: true
            },
            // 地图对象
            amap: {
                zoom: 16,
                center: [106.893565, 27.644778],
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
                        text: "区政府",
                        offset: [0, 30]
                    }
                ]
            }
        };
    },
    created(){
        // this.getFormData();
    },
    methods: {
        getFormData() {
            return {
                lat: "27.644778",
                lon: "106.893565",
                orgAddr: "区政府"
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
    }
};
</script>

<style lang="scss">

.vueAmap {
    width: 800px;
    height: 800px;
    margin: 50px auto 0;
    position: relative;

    .search-box {
    position: absolute;
    right: 20px !important;
    top: 30px !important;
}
}
</style>
