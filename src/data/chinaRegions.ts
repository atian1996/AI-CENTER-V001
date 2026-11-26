export interface ChinaProvinceOption {
  province: string;
  cities: string[];
}

/**
 * 中国省级行政区及主要城市字典（含全部 34 个省级行政区，包含香港、澳门、台湾地区）
 */
export const CHINA_REGIONS: ChinaProvinceOption[] = [
  { province: '北京市', cities: ['北京市'] },
  { province: '上海市', cities: ['上海市'] },
  { province: '天津市', cities: ['天津市'] },
  { province: '重庆市', cities: ['重庆市'] },
  {
    province: '江苏省',
    cities: ['南京市', '苏州市', '无锡市', '常州市', '南通市', '扬州市', '徐州市', '镇江市', '泰州市', '盐城市', '淮安市', '连云港市', '宿迁市']
  },
  {
    province: '浙江省',
    cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市']
  },
  {
    province: '广东省',
    cities: ['广州市', '深圳市', '珠海市', '佛山市', '东莞市', '中山市', '惠州市', '江门市', '汕头市', '湛江市', '肇庆市', '清远市']
  },
  {
    province: '山东省',
    cities: ['济南市', '青岛市', '烟台市', '威海市', '潍坊市', '淄博市', '济宁市', '临沂市', '泰安市', '日照市', '东营市']
  },
  {
    province: '安徽省',
    cities: ['合肥市', '芜湖市', '马鞍山市', '蚌埠市', '安庆市', '滁州市', '阜阳市', '淮南市', '六安市', '宣城市']
  },
  {
    province: '四川省',
    cities: ['成都市', '绵阳市', '德阳市', '宜宾市', '泸州市', '南充市', '乐山市', '达州市', '眉山市']
  },
  {
    province: '湖北省',
    cities: ['武汉市', '襄阳市', '宜昌市', '荆州市', '黄石市', '十堰市', '孝感市', '鄂州市']
  },
  {
    province: '湖南省',
    cities: ['长沙市', '株洲市', '湘潭市', '衡阳市', '岳阳市', '常德市', '郴州市', '张家界市']
  },
  {
    province: '福建省',
    cities: ['福州市', '厦门市', '泉州市', '漳州市', '莆田市', '宁德市', '三明市', '龙岩市']
  },
  {
    province: '陕西省',
    cities: ['西安市', '咸阳市', '宝鸡市', '渭南市', '延安市', '榆林市', '汉中市']
  },
  {
    province: '河南省',
    cities: ['郑州市', '洛阳市', '开封市', '新乡市', '南阳市', '许昌市', '焦作市', '安阳市']
  },
  {
    province: '河北省',
    cities: ['石家庄市', '唐山市', '保定市', '廊坊市', '秦皇岛市', '邯郸市', '沧州市', '雄安新区']
  },
  {
    province: '辽宁省',
    cities: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '锦州市', '营口市']
  },
  {
    province: '吉林省',
    cities: ['长春市', '吉林市', '四平市', '通化市', '松原市', '延边朝鲜族自治州']
  },
  {
    province: '黑龙江省',
    cities: ['哈尔滨市', '齐齐哈尔市', '大庆市', '牡丹江市', '佳木斯市']
  },
  {
    province: '江西省',
    cities: ['南昌市', '赣州市', '九江市', '景德镇市', '上饶市', '宜春市']
  },
  {
    province: '山西省',
    cities: ['太原市', '大同市', '晋中市', '长治市', '运城市', '临汾市']
  },
  {
    province: '云南省',
    cities: ['昆明市', '曲靖市', '大理白族自治州', '丽江市', '玉溪市']
  },
  {
    province: '贵州省',
    cities: ['贵阳市', '遵义市', '毕节市', '六盘水市', '安顺市']
  },
  {
    province: '海南省',
    cities: ['海口市', '三亚市', '儋州市', '琼海市']
  },
  {
    province: '甘肃省',
    cities: ['兰州市', '天水市', '酒泉市', '嘉峪关市', '白银市']
  },
  {
    province: '青海省',
    cities: ['西宁市', '海东市', '格尔木市']
  },
  {
    province: '内蒙古自治区',
    cities: ['呼和浩特市', '包头市', '鄂尔多斯市', '赤峰市', '呼伦贝尔市']
  },
  {
    province: '广西壮族自治区',
    cities: ['南宁市', '柳州市', '桂林市', '北海市', '钦州市']
  },
  {
    province: '西藏自治区',
    cities: ['拉萨市', '日喀则市', '林芝市']
  },
  {
    province: '宁夏回族自治区',
    cities: ['银川市', '石嘴山市', '吴忠市', '中卫市']
  },
  {
    province: '新疆维吾尔自治区',
    cities: ['乌鲁木齐市', '克拉玛依市', '喀什地区', '伊犁哈萨克自治州', '昌吉回族自治州']
  },
  {
    province: '香港特别行政区',
    cities: ['香港岛', '九龙', '新界']
  },
  {
    province: '澳门特别行政区',
    cities: ['澳门半岛', '氹仔', '路环']
  },
  {
    province: '台湾省',
    cities: ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市', '新竹市']
  }
];

/**
 * 根据城市名反查所属省级行政区名称
 */
export function inferProvinceByCity(city: string): string {
  const normalized = city.trim();
  for (const region of CHINA_REGIONS) {
    if (region.province === normalized || region.cities.includes(normalized)) {
      return region.province;
    }
  }
  return '上海市';
}

/**
 * 手机号脱敏：将 11 位手机号（或含横杠的手机号）自动打码为 138****6612
 */
export function maskPhoneNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}****${digits.slice(7)}`;
  }
  if (digits.length >= 7) {
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  }
  return phone || '—';
}
