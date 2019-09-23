// 管理员
const Admin = {
  name: "Admin",
  columns: {
    id: {
      primary: true,
      type: "int"
    },
    username: {
      type: "varchar",
      unique: true
    },
    pwd: {
      type: "varchar"
    },
    created: {
      type: "datetime"
    },
    updated: {
      type: "datetime",
      nullable: true
    },
    // 0表示正常
    status: {
      type: "int"
    }
  }
}

//币种相关信息表
const Assets = {
  name: "Assets",
  columns: {
    id: { primary: true, type: 'varchar'},
    code: { type: 'varchar' },
    issuer: { type: 'varchar', nullable: true },
    // 状态字段，0表示默认支持，-1表示停止支持
    state: { type: 'int', default: 0 },
    // 备注 
    memo: { type: 'varchar', nullable: true } 
  }
}

//余额表，包括XFF  XHB两个币种，XFF是游戏赢取的，XHB是拆红包得到的，暂时只有XHB即可
//包括：G地址、币种ID、余额、冻结余额、已提币、
const Balances = {
  name: 'Balances',
  columns: {
    id: { primary: true, type: 'varchar' },
    accountid: { type: 'varchar' },
    assetid: { type: 'varchar' },
    //TODO 大小问题
    balance: { type: 'decimal',default: 0.0 },
    freeze: { type: 'decimal', default: 0.0 },
    withdraws: { type: 'decimal', default: 0.0 }

  }
}

// 红包房间表
const RPRoom = {
  name: 'RPRoom',
  columns: {
    
    id: { primary: true, type: 'varchar' },
//TODO 自增字段
    rpno: { type: 'int'},
    // 房间类型：0表示必赢类，1表示比手气，2表示红包接龙
    itype: { type: 'int' },
    // 房间需要几个人才能开局
    pno: { type: 'int' },

    // 门票
    ticket: { type: 'decimal' },
    //门票资产
    assetid: { type: 'varchar' },

    //状态：0为初始状态，未开始，1表示游戏开始，2表示游戏结束，3表示游戏结算完成待支付，4表示游戏支付完成
    state: { type: 'int', default: 0},
    created: { type: 'datetime' },
    started: { type: 'datetime', nullable: true },
    ended: { type: 'datetime', nullable: true},
    // 结算时间
    stltime: { type: 'datetime', nullable: true},
    // 支付时间
    paytime: { type: 'datetime', nullable: true}

  }
}

const ITYPE_RP_WIN = 0;
// 比手气红包
const ITYPE_RP_CHANCE = 1;
// 红包接龙
const ITYPE_RP_LONG = 2;

// 未满员的房间
const STATE_ROOM_DEFAULT = 0;
const STATE_ROOM_START = 1;
const STATE_ROOM_END = 2;
const STATE_ROOM_WILLPAY = 3;
const STATE_ROOM_PAYED = 4;
// 支持失败
const STATE_ROOM_FAIL = -1;

// 红包参与表
const RPPart = {
  name: 'RPPart',
  columns: {
    id: { primary: true, type: 'varchar' },
    accountid: { type: 'varchar' },
    roomid: { type: 'varchar' },
    created: { type: 'datetime' },
    // 门票的hash值
    thash: { type: 'varchar' },
    // 表示参与成功还是失败0是初始，1是成功，2是失败
    state: { type: 'int' },
    // 门票信息
    ticket: { type: 'decimal' },
    assetid: { type: 'varchar' }

  }
}

// 红包表，发起的红包情况，及状态
const RPTrans = {
  name: 'RPTrans',
  columns: {
    id: { primary: true, type: 'varchar' },
    roomid: { type: 'varchar' },
    // 红包数量
    amount: { type: 'decimal' },
    // 红包类型，0表示XFF，全都有的红包，1表示比欧气红包，2表示接龙红包
    itype: { type: 'int' },
    // 红包的发起者，可能是系统发起，可能是用户发的
    sender: { type: 'varchar' },
    // 一共有多少个包
    cnt: {type: 'int' },
    assetid: { type: 'varchar'},
    created: { type: 'datetime' },
    //0表示创建，1表示已经领取完了,2表示过期(10分钟有效期)
    state: { type: 'int'}

  }
}

const STATE_RP_DEFAULT = 0;
const STATE_RP_ALL = 1;
const STATE_RP_OUT = 2;

// 红包领取表，即每个红包房间发出的红包与领取情况
const RPSTrans = {
  name: 'RPSTrans',
  columns: {
    id: { primary: true, type: 'varchar' },
    roomid: { type: 'varchar' },
    //哪个红包
    transid: { type: 'varchar' },
    //XFF的数量
    amount: { type: 'decimal' },
    assetid: { type: 'varchar' },
    // XHB的数量
    xhb: { type: 'decimal' },
    // 状态，0为创建成功，1表示领取完成，2表示有XFF待发送，3表示XFF已经发送完成,-1表示XFF发送失败
    state: { type: 'int' },
    created: { type: 'datetime' },
    // XFF发送的HASH表
    uphash: { type: 'varchar' },
    updated: { type: 'datetime' },
    //手续费
    fee: { type: 'decimal' },


  }
}

const STATE_RPS_DEFAULT = 0;
const STATE_RPS_OPENED = 1;
const STATE_RPS_WILLSEND = 2;
const STATE_RPS_SENDED =  3;
const STATE_RPS_FAIL = -1;


每周手续费统计表 周五 10点（UTC+8）进行统计，后续要根据XHB进行分发
const WeekFee = {
  name: 'WeekFee',
  columns: {
    id: { type: 'varchar', primary: true},
    wday: {type: 'varchar'},
    // 第几周，递增的
    no:{ type: 'int' },
    amount: { type:'decimal'},
    // 手续费资产
    assetid: { type: 'varchar' },
    created: { type: 'datetime' },
    // 发放多少出去
    sended: { type: 'decimal'}
  }
}

// 分红表，每周五10点（UTC+8）统计上周五到本周五的手续费，然后统统
const Rewards = {
  name: 'Rewards',
  columns: {
    id: { type: 'varchar', primary: true },
    // 哪一天
    wday: {type: 'varchar'},
    accountid: { type: 'varchar' },
    // xhb的拥有量
    xhb:{ type: 'decimal'},
    // 分红量
    amount: { type: 'decimal' },
    //资产
    assetid: { type: 'varchar' },
    created: { type: 'datetime' },
    updated: { type: 'datetime' },
    uphash: { type: 'varchar' }
  }
}

// XHB提币记录
const withdraws = {
  name: 'Withdraws',
  columns: {
    id: { type: 'varchar', primary: true },
    accountid: { type: 'varchar'},
    created: { type: 'datetime'},
    amount: { type: 'decimal'},
    assetid: {type: 'varchar'},
    // 状态，0是未执行，1表示执行成功，-1表示执行失败
    state: { type: 'int', default: 0},
    updated: { type: 'varchar'},
    uphash: { type: 'varchar'},
    // 失败的原因
    errmsg: { type: 'varchar'},
    // 重试错误次数
    errno: { type: 'int', default: 0}
  }
}


const STATE_WD_DEFAULT = 0;
const STATE_WD_OK = 1;
const STATE_WD_FAIL = -1;


module.exports = {
  Admin,
  Assets,
  Balances,
  RPRoom,
  RPPart,
  RPTrans,
  RPSTrans,
  WeekFee,
  Rewards,
  Withdraws,


  ITYPE_RP_WIN,
  ITYPE_RP_CHANCE,
  ITYPE_RP_LONG,
  STATE_ROOM_DEFAULT,
  STATE_ROOM_START,
  STATE_ROOM_END,
  STATE_ROOM_WILLPAY,
  STATE_ROOM_PAYED,
  STATE_ROOM_FAIL,

  STATE_RPS_DEFAULT,
  STATE_RPS_OPENED,
  STATE_RPS_WILLSEND,
  STATE_RPS_SENDED,
  STATE_RPS_FAIL,


  STATE_WD_DEFAULT,
  STATE_WD_OK,
  STATE_WD_FAIL,


}


