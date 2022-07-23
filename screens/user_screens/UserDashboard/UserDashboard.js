import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {icons, COLORS, SIZES, FONTS} from '../../../constants';
import {InProgressModal, DoneModal} from '../TaskModal';
//saurabh
import UserAssignWorks from './UserAssignWorks';

const UserDashboard = () => {
  const [inProgressModal, setinProgressModal] = React.useState(false);
  const [doneModal, setdoneModal] = React.useState(false);
  const [inProgressModalnum, setinProgressModalNum] = React.useState(false);
  const [doneModalnum, setdoneModalNum] = React.useState(false);

  const handleInProgressTask = () => {
    setinProgressModalNum(true);
    setinProgressModal(true);
  };
  const handleDoneTask = () => {
    setdoneModalNum(true);
    setdoneModal(true);
  };

  return (
    <View>
      <UserAssignWorks />
      <View
        style={{
          marginHorizontal: SIZES.radius,
          paddingHorizontal: SIZES.radius,
          paddingVertical: SIZES.radius,
          borderRadius: SIZES.base,
          backgroundColor: COLORS.lightblue_500,
          ...styles.shadow,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: COLORS.white,
            padding: 10,
            borderRadius: 5,
            ...styles.shadow,
          }}
          onPress={() => handleInProgressTask()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={icons.inprogress} style={{height: 25, width: 25}} />
            <Text style={{...FONTS.h3, color: COLORS.darkGray, left: 10}}>
              Task In Progress
            </Text>
          </View>
          <Text style={{...FONTS.h3, color: COLORS.darkGray}}>2</Text>
        </TouchableOpacity>
        {inProgressModalnum && (
          <InProgressModal
            inProgressModal={inProgressModal}
            setinProgressModal={setinProgressModal}
          />
        )}

        <TouchableOpacity
          style={{
            marginTop: SIZES.base,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: COLORS.white,
            padding: 10,
            borderRadius: 5,
            ...styles.shadow,
          }}
          onPress={() => handleDoneTask()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={icons.done} style={{height: 25, width: 25}} />
            <Text style={{...FONTS.h3, color: COLORS.darkGray, left: 10}}>
              Completed
            </Text>
          </View>
          <Text style={{...FONTS.h3, color: COLORS.darkGray}}>3</Text>
        </TouchableOpacity>
        {doneModalnum && (
          <DoneModal doneModal={doneModal} setdoneModal={setdoneModal} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default UserDashboard;
