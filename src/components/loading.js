import { View, Text ,Dimensions} from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress'

const {width,height} =Dimensions.get('window');
export default function Loading() {
  return (
    <View style={{height:'100%',width,backgroundColor:'#000',}} className="absolute flex-row justify-center items-center">
    <Progress.CircleSnail thickness={12} size={160} color='#1DB954'/>
    </View>
  )
}