// 标签统计柱状图
hexo.extend.helper.register('tag_ranking_bar', function (options) {
    const { type, id, topNum, title, color, yAxisName, seriesName } = options
    // id 和 type 必须指定
    if (!id || !type) return
    // 获取 tags 标签页信息
    const tagArr = []
    hexo.locals.get('tags').map(function (tag) {
        tagArr.push([tag.name, tag.length])
    })
    // 对数组进行排序，然后取  top 10
    tagArr.sort((x, y) => { return y[0] - x[0] })
    const echarts_obj = {
        tag: tagArr.slice(0, topNum)
    }
    return `
    <script type="text/javascript" id="${id}">
    var themeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    var tagsChart = echarts.init(document.getElementById("${id}"),themeMode);

    // 指定图表的配置项和数据
    var tagsOption = {
        color: "${color}",
        backgroundColor: '',
        title: {
            text: "${title}",
            x: 'center'
        },
        dataset: [
            {
                dimensions: ['name', 'count'],
                source: ${JSON.stringify(echarts_obj[type])}
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'count', order: 'desc' }
                }
            }
        ],
        tooltip: {},
        xAxis: {
            type: 'category'
        },
        yAxis: {
            name: "${yAxisName}",
            type: 'value',
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true
            }
        },
        series: {
            name: "${seriesName}",
            type: 'bar',
            encode: { x: 'name', y: 'count' },
            datasetIndex: 1,
            itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
            markPoint: {
                symbolSize: 45,
                data: [
                    {
                        type: 'max',
                        itemStyle: { color: '#425aef' },
                        name: '最大值'
                    },
                    {
                        type: 'min',
                        itemStyle: { color: '#425aef' },
                        name: '最小值'
                    }
                ]
            },
            markLine: {
                itemStyle: { color: '#425aef' },
                data: [{ type: 'average', name: '平均值' }]
            }
        }
    };
    // 使用刚指定的配置项和数据显示图表。
    tagsChart.setOption(tagsOption);
    window.addEventListener("resize", () => {
        tagsChart.resize();
    });
    </script>`
})


hexo.extend.helper.register('categories_pic', function (options) {
    const { id, title, seriesName } = options
    // id  必须指定
    if (!id) return
    const categoryArr = []
    hexo.locals.get('categories').map(function (category) {
        categoryArr.push({ name: category.name, value: category.length })
    })
    return `
    <script type="text/javascript" id="${id}">
    var themeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    var categoriesChart = echarts.init(document.getElementById("${id}"),themeMode);
    // 指定图表的配置项和数据
    var categoriesOption = {
        backgroundColor:'',
        title:{
            text:'${title}',
            x:'center'
        },
        tooltip:{
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            icon: "circle",
            top: 'bottom'
        },
        series: [
            {
            name: '${seriesName}',
            type: 'pie',
            radius: [40, 150],
            center: ['50%', '48%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            label: {
                formatter: "{b} : {c} ({d}%)"
            },
            data: ${JSON.stringify(categoryArr)}
            }
        ]
        };
    // 使用刚指定的配置项和数据显示图表。
    categoriesChart.setOption(categoriesOption);
    window.addEventListener("resize", () => {
        categoriesChart.resize();
    });
    </script>`
})


hexo.extend.helper.register('posts_echarts', function (options) {
    let { title, id, seriesName } = options
    var moment = require('moment');
    const startDate = moment().subtract(1, 'years').startOf('month')
    const endDate = moment().endOf('month')

    const monthMap = new Map()
    const dayTime = 3600 * 24 * 1000
    for (let time = startDate; time <= endDate; time += dayTime) {
        const month = moment(time).format('YYYY-MM')
        if (!monthMap.has(month)) {
            monthMap.set(month, 0)
        }
    }
    hexo.locals.get('posts').forEach(function (post) {
        const month = post.date.format('YYYY-MM')
        if (monthMap.has(month)) {
            monthMap.set(month, monthMap.get(month) + 1)
        }
    })
    let postsArr = [...monthMap.entries()]
    return `
  <script type="text/javascript" id="${id}">
    var themeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    var postsChart = echarts.init(document.getElementById("${id}"),themeMode);
    let postsOption = {
        color: ['#425aef'],
        title:{
          text:'${title}',
          x:'center'
        },
        tooltip:{
            trigger: 'axis',
               axisPointer: {
                   type: 'shadow',
                   shadowStyle:{
                     color:'rgba(66,90,239,0.3)'
                   }
               },
         },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          name:'${seriesName}',
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name:'${seriesName}',
            type: 'line',
            smooth:true,
            symbol: 'none',
            lineStyle: {
              color: '#425aef',
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#425aef',
                  }, {
                      offset: 1,
                      color: '#FFFFFF'
                  }])
            },
            data: ${JSON.stringify(postsArr)}
          }
        ]
      };
    postsChart.setOption(postsOption);
    window.addEventListener("resize", () => { 
        postsChart.resize();
      });
    </script>`
})

const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function (locals) {
    const $ = cheerio.load(locals)
    const post = $('#posts-chart')
    const tag = $('#tags-chart')
    const category = $('#categories-chart')
    const htmlEncode = false

    if (post.length > 0 || tag.length > 0 || category.length > 0) {
        if (post.length > 0 && $('#postsChart').length === 0) {
            if (post.attr('data-encode') === 'true') htmlEncode = true
            post.after(postsChart(post.attr('data-start')))
        }
        if (tag.length > 0 && $('#tagsChart').length === 0) {
            if (tag.attr('data-encode') === 'true') htmlEncode = true
            tag.after(tagsChart(tag.attr('data-length')))
        }
        if (category.length > 0 && $('#categoriesChart').length === 0) {
            if (category.attr('data-encode') === 'true') htmlEncode = true
            category.after(categoriesChart(category.attr('data-parent')))
        }

        if (htmlEncode) {
            return $.root().html().replace(/&amp;#/g, '&#')
        } else {
            return $.root().html()
        }
    } else {
        return locals
    }
}, 15)

function postsChart (startMonth) {
    const startDate = moment(startMonth || '2020-01')
    const endDate = moment()

    const monthMap = new Map()
    const dayTime = 3600 * 24 * 1000
    for (let time = startDate; time <= endDate; time += dayTime) {
        const month = moment(time).format('YYYY-MM')
        if (!monthMap.has(month)) {
            monthMap.set(month, 0)
        }
    }
    hexo.locals.get('posts').forEach(function (post) {
        const month = post.date.format('YYYY-MM')
        if (monthMap.has(month)) {
            monthMap.set(month, monthMap.get(month) + 1)
        }
    })
    const monthArr = JSON.stringify([...monthMap.keys()])
    const monthValueArr = JSON.stringify([...monthMap.values()])

    return `
  <script id="postsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var postsChart = echarts.init(document.getElementById('posts-chart'), 'light');
    var postsOption = {
      title: {
        text: '文章发布统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '日期',
        type: 'category',
        boundaryGap: false,
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${monthArr}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        nameTextStyle: {
          color: color
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'line',
        smooth: true,
        lineStyle: {
            width: 0
        },
        showSymbol: false,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          }, {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        data: ${monthValueArr},
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              color: color
            }
          }]
        }
      }]
    };
    postsChart.setOption(postsOption);
    window.addEventListener('resize', () => { 
      postsChart.resize();
    });
    postsChart.on('click', 'series', (event) => {
      if (event.componentType === 'series') window.location.href = '/archives/' + event.name.replace('-', '/');
    });
  </script>`
}

function tagsChart (len) {
    const tagArr = []
    hexo.locals.get('tags').map(function (tag) {
        tagArr.push({ name: tag.name, value: tag.length, path: tag.path })
    })
    tagArr.sort((a, b) => { return b.value - a.value })

    const dataLength = Math.min(tagArr.length, len) || tagArr.length
    const tagNameArr = []
    for (let i = 0; i < dataLength; i++) {
        tagNameArr.push(tagArr[i].name)
    }
    const tagNameArrJson = JSON.stringify(tagNameArr)
    const tagArrJson = JSON.stringify(tagArr)

    return `
  <script id="tagsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var tagsChart = echarts.init(document.getElementById('tags-chart'), 'light');
    var tagsOption = {
      title: {
        text: 'Top ${dataLength} 标签统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {},
      xAxis: {
        name: '标签',
        type: 'category',
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color,
          interval: 0
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${tagNameArrJson}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'bar',
        data: ${tagArrJson},
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(128, 255, 195)'
            },
            {
              offset: 1,
              color: 'rgba(1, 211, 255)'
            }])
          }
        },
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              color: color
            }
          }]
        }
      }]
    };
    tagsChart.setOption(tagsOption);
    window.addEventListener('resize', () => { 
      tagsChart.resize();
    });
    tagsChart.on('click', 'series', (event) => {
      if(event.data.path) window.location.href = '/' + event.data.path;
    });
  </script>`
}

function categoriesChart (dataParent) {
    const categoryArr = []
    let categoryParentFlag = false
    hexo.locals.get('categories').map(function (category) {
        if (category.parent) categoryParentFlag = true
        categoryArr.push({
            name: category.name,
            value: category.length,
            path: category.path,
            id: category._id,
            parentId: category.parent || '0'
        })
    })
    categoryParentFlag = categoryParentFlag && dataParent === 'true'
    categoryArr.sort((a, b) => { return b.value - a.value })
    function translateListToTree (data, parent) {
        let tree = []
        let temp
        data.forEach((item, index) => {
            if (data[index].parentId == parent) {
                let obj = data[index];
                temp = translateListToTree(data, data[index].id);
                if (temp.length > 0) {
                    obj.children = temp
                }
                if (tree.indexOf())
                    tree.push(obj)
            }
        })
        return tree
    }
    const categoryNameJson = JSON.stringify(categoryArr.map(function (category) { return category.name }))
    const categoryArrJson = JSON.stringify(categoryArr)
    const categoryArrParentJson = JSON.stringify(translateListToTree(categoryArr, '0'))

    return `
  <script id="categoriesChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var categoriesChart = echarts.init(document.getElementById('categories-chart'), 'light');
    var categoryParentFlag = ${categoryParentFlag}
    var categoriesOption = {
      title: {
        text: '文章分类统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      legend: {
        top: 'bottom',
        data: ${categoryNameJson},
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: []
    };
    categoriesOption.series.push(
      categoryParentFlag ? 
      {
        nodeClick :false,
        name: '文章篇数',
        type: 'sunburst',
        radius: ['15%', '90%'],
        center: ['50%', '55%'],
        sort: 'desc',
        data: ${categoryArrParentJson},
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          emphasis: {
            focus: 'ancestor',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }
      :
      {
        name: '文章篇数',
        type: 'pie',
        radius: [30, 80],
        roseType: 'area',
        label: {
          color: color,
          formatter: '{b} : {c} ({d}%)'
        },
        data: ${categoryArrJson},
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }
    )
    categoriesChart.setOption(categoriesOption);
    window.addEventListener('resize', () => { 
      categoriesChart.resize();
    });
    categoriesChart.on('click', 'series', (event) => {
      if(event.data.path) window.location.href = '/' + event.data.path;
    });
  </script>`
}
function switchPostChart () {
    // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
        try {
            let postsOptionNew = postsOption
            postsOptionNew.title.textStyle.color = color
            postsOptionNew.xAxis.nameTextStyle.color = color
            postsOptionNew.yAxis.nameTextStyle.color = color
            postsOptionNew.xAxis.axisLabel.color = color
            postsOptionNew.yAxis.axisLabel.color = color
            postsOptionNew.xAxis.axisLine.lineStyle.color = color
            postsOptionNew.yAxis.axisLine.lineStyle.color = color
            postsOptionNew.series[0].markLine.data[0].label.color = color
            postsChart.setOption(postsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
        try {
            let tagsOptionNew = tagsOption
            tagsOptionNew.title.textStyle.color = color
            tagsOptionNew.xAxis.nameTextStyle.color = color
            tagsOptionNew.yAxis.nameTextStyle.color = color
            tagsOptionNew.xAxis.axisLabel.color = color
            tagsOptionNew.yAxis.axisLabel.color = color
            tagsOptionNew.xAxis.axisLine.lineStyle.color = color
            tagsOptionNew.yAxis.axisLine.lineStyle.color = color
            tagsOptionNew.series[0].markLine.data[0].label.color = color
            tagsChart.setOption(tagsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
        try {
            let categoriesOptionNew = categoriesOption
            categoriesOptionNew.title.textStyle.color = color
            categoriesOptionNew.legend.textStyle.color = color
            if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
            categoriesChart.setOption(categoriesOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
}
// document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
