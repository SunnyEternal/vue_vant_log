<template>
  <div>
    <div ref="logItem">
      <van-swipe-cell >
        <van-cell-group>
          <div class="logBox">
            <div class="logTitle">
              <h3>
                <span class="code">1292</span>
                <!-- <span class="code">{{item.codeId}}</span>  -->
                【中安星云】数据安全数据安全数据安全平台##V1.5.0功能开发
                <!-- {{item.title}} -->
              </h3>
              <span class="evaluate">需求评估</span>
              <!-- <span class="evaluate">{{item.module}}</span> -->
            </div>
            <div class="logDetail">
              <p>完成数据源管理、架构扫描、敏感扫描等模块的需求规格评估及确定工作</p>
              <!-- <p>{{item.desc}}</p> -->
              <!-- <span class="time">{{item.time}}</span> -->
              <span class="time">4.5H</span>
            </div>
          </div>
        </van-cell-group>
        <template #right>
          <van-button square type="danger" text="删除" />
          <van-button square type="info" text="编辑" />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
