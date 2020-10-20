$(function () {
    // 动态创建遮罩层
    var cover = document.getElementsByClassName('cover')[0];
    var text = document.createElement('div');
    text.setAttribute('class', 'cover-text');
    var chart = document.createElement('div');
    chart.setAttribute('id', 'chart');
    chart.setAttribute('class', 'cover-chart');

    var key = ['分辨率 ', '帧率 ', '量化 ', '色域 ', '动态范围 ', '音频采样频率 ', '编码码率 ', '流畅度'];
    var value = ['3840*2160', '（扫描模式） 50HZ（逐行）', '10bit', 'BT.2020', 'HLG/100nit （GY/T 315-2018）', '42kHz', '（文件封装）', ''];
    var row = '';

    // 添加静态数据
    for (var i = 0; i < key.length; i++) {
        row = document.createElement('div');
        row.innerText = key[i] + '\xa0\xa0\xa0' + value[i];
        text.appendChild(row);
    }

    cover.appendChild(text);
    cover.appendChild(chart);

    // 数据项
    var dataX = [];
    var dataY = [[], [], []];
    var url = 'http://a.1029.lcps.aodianyun.com/getStatus'

    // 获取最新数据
    function getData() {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify({}),
            dataType: 'json',
            success: function (res) {
                dataX.push(getNowFormatDate());
                // 测试数据
                // dataY[0].push(1 - res.sourceStatistics_5s[0].empty / res.sourceStatistics_5s[0].sum+Math.random());
                // dataY[1].push(1 - res.sourceStatistics_5s[1].empty / res.sourceStatistics_5s[1].sum+Math.random());
                // dataY[2].push(1 - res.sourceStatistics_5s[1].empty / res.sourceStatistics_5s[1].sum+Math.random());
                // 实际数据
                dataY[0].push(1 - res.sourceStatistics_5s[0].empty / res.sourceStatistics_5s[0].sum);
                dataY[1].push(1 - res.sourceStatistics_5s[1].empty / res.sourceStatistics_5s[1].sum);
                dataY[2].push(1 - res.sourceStatistics_5s[2].empty / res.sourceStatistics_5s[2].sum);
                if (dataX.length < 2) {
                    dataX.push(dataX[0]);
                    dataY[0].push(dataY[0][0]);
                    dataY[1].push(dataY[1][0]);
                    dataY[2].push(dataY[2][0]);
                } else if (dataX.length > 60) {
                    dataX.shift();
                    dataY[0].shift();
                    dataY[1].shift();
                    dataY[2].shift();
                }
                chart.update({
                    series: [{
                        data: dataY[0]
                    },{
                        data: dataY[1]
                    },{
                        data: dataY[2]
                    }],
                    xAxis: {
                        categories: dataX
                    }
                });
            },
            error: function () { }
        });
    }

    function getNowFormatDate() { // 获取当前时间
        var date = new Date();
        var seperator = ":";
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        h = h > 9 ? h : '0' + h;
        m = m > 9 ? m : '0' + m;
        s = s > 9 ? s : '0' + s;
        return h + seperator + m + seperator + s;
    }

    // chart配置
    var chart = Highcharts.chart('chart', {
        chart: {
            type: 'area',
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        title: {
            // text: 'PGM视频输出码率',
            text: null,
            // text: '信源流畅度',
            // align: 'left',
            // x: 10,
            // style: {
            //     color: '#fff',
            //     fontSize: '1.56vw',
            //     fontFamily: 'SimHei'
            // }
        },
        legend: {
            itemStyle: { // 底部字体
                color: '#fff',
                fontSize: '1vw',
                fontFamily: 'SimHei',
                fontWeight: "100"
            },
            // align: "right", // 程度标的目标地位
            // verticalAlign: "top" //垂直标的目标地位
        },
        xAxis: {
            categories: dataX,
            lineWidth: 0,
            tickWidth: 0,
            // labels: {
            //     enabled: false
            // },
            // tickAmount: 2, //刻度线数量
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '1vw',
                    fontFamily: 'SimHei',
                    fontWeight: "100"
                },
                formatter: function () {
                    if (this.isFirst || this.isLast) {
                        return '<span>' + this.value + '</span>'
                    } else {
                        return '<span style="display: none">' + this.value + '</span>'
                    }
                }
            }
        },
        yAxis: {
            lineWidth: 0,
            tickWidth: 0,
            // title: { // y轴标题字体
            //     align: 'high',
            //     offset: 0,
            //     rotation: 0,
            //     y: -20,
            //     x: 20,
            //     text: 'Kbps',
            //     style: {
            //         color: '#fff',
            //         fontSize: '1vw',
            //         fontFamily: 'SimHei',
            //         fontWeight: "100"
            //     }
            // },
            title: {
                align: null
            },
            gridLineDashStyle: 'ShortDot',
            tickAmount: 5,
            labels: { // y轴刻度字体
                style: {
                    color: '#fff',
                    fontSize: '1vw',
                    fontFamily: 'SimHei',
                    fontWeight: "100"
                }
            }
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 1.5 // 线宽
            },
            area: {
                enableMouseTracking: false, // 关闭鼠标跟踪
                fillOpacity: 0.2 // 透明度
            }
        },
        series: [{
            name: '信源1',
            data: dataY[0],
            color: '#FE3A3B',
            marker: { // 线上数据点
                radius: 0,
                lineWidth: 0
            }
        },
        {
            name: '信源2',
            data: dataY[1],
            color: '#107EF2',
            marker: {
                radius: 0,
                lineWidth: 0
            }
        },
        {
            name: '信源3',
            data: dataY[2],
            color: '#1AC81A',
            marker: {
                radius: 0,
                lineWidth: 0
            }
        }]
    });

    getData();

    // 更新数据
    setInterval(function () {
        getData();
    }, 60000)
});