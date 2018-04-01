import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},//歌手
  playing: false,//播放还是暂停
  fullScreen: false,//是否全屏
  playlist: [],//播放列表
  sequenceList: [],//顺序列表
  mode: playMode.sequence,//播放模式
  currentIndex: -1,//当前播放索引
  disc: {},//歌单对象
  topList: {},//排行
  searchHistory: loadSearch(),//搜索历史
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
