import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Animated,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {IconButton, ConformationAlert} from '../../../Components';
import {COLORS, SIZES, icons, FONTS} from '../../../constants';
import Config from '../../../config';
import WorkAssignModal from '../Modals/WorkAssignModal';
import {Swipeable} from 'react-native-gesture-handler';

const AssignedWorks = () => {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [assignWorkData, setAssignWorkData] = React.useState([]);
  const [filterRoleModal, setFilterRoleModal] = React.useState(false);
  const [showWorkModal, setWorkModal] = React.useState(false);
  const [items, setItems] = React.useState([]);

  // Get All Assign Works
  React.useEffect(() => {
    fetch(`${Config.API_URL}assign-works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setAssignWorkData(data);
      })
      .catch(error => console.log(error.message));
  }, [assignWorkData]);

  React.useEffect(() => {
    fetch(`${Config.API_URL}role`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setItems(data);
      })
      .catch(error => console.log(error.message));
  }, []);

  // Edit Assign Works
  const OnEdit = id => {
    setWorkModal(true);
    fetch(`${Config.API_URL}assign-works/` + `${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    });
  };

  // Delete Assign Works
  const OnDeleteAssignWork = id => {
    // alert(id);
    // console.log(id);
    fetch(`${Config.API_URL}assign-works/` + `${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const ondel = id => {
    console.log(id);
    setDeleteConfirm(true);
    setI(id);
  };
  const [i, setI] = React.useState('');

  const OnDeleteAssignWorks = () => {
    console.log('en', i);
    fetch(`${Config.API_URL}sub-assign-work/` + `${i}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
      })
      .catch(error => console.log(error.message));
    setDeleteConfirm(false);
  };
  // function OnChangeValueHandler(id) {
  //   console.log(id);
  //   setFilterRoleModal(false);
  //   let filt = assignWorkData?.filter(a => a.role_id == id);
  //   setNewData(filt);
  // }
  // const [newData, setNewData] = React.useState([]);

  function renderRoleFilterModal() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
          }}
          onPress={() => OnChangeValueHandler(item._id)}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              textTransform: 'capitalize',
            }}>
            {item.user_role}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <Modal animationType="fade" transparent={true} visible={filterRoleModal}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              // backgroundColor: COLORS.transparentBlack2,
            }}>
            <View
              style={{
                backgroundColor: COLORS.darkBlue,
                position: 'absolute',
                width: '100%',
                height: '40%',
                paddingHorizontal: SIZES.radius,
                paddingTop: SIZES.radius,
                paddingBottom: SIZES.padding,
                borderTopRightRadius: SIZES.base,
                borderTopLeftRadius: SIZES.base,
              }}>
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() => setFilterRoleModal(false)}>
                <Image
                  source={icons.cross}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.darkGray2,
                  }}
                />
              </TouchableOpacity>

              <FlatList
                data={items}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: COLORS.lightGray1,
                        marginVertical: SIZES.base,
                      }}></View>
                  );
                }}
                style={{
                  padding: SIZES.padding,
                  marginBottom: SIZES.padding,
                }}
                ListFooterComponent={
                  <View
                    style={{
                      marginBottom: SIZES.padding,
                    }}></View>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderSwipeList() {
    const renderRight = (progress, id) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
      });
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 80,
            transform: [{translateX: 0}],
          }}>
          <TouchableOpacity
            onPress={
              () => ondel(id)
              // setDeleteConfirm(true)
              // OnDeleteAssignWorks(id);
            }>
            <ImageBackground
              style={{
                backgroundColor: COLORS.warning_200,
                padding: 5,
                borderRadius: SIZES.base,
                right: 10,
              }}>
              <Image
                source={icons.delete_icon}
                style={{height: 15, width: 15, tintColor: COLORS.rose_600}}
              />
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity>
            <ImageBackground
              style={{
                backgroundColor: COLORS.lightblue_200,
                padding: 5,
                borderRadius: SIZES.base,
              }}>
              <Image
                source={icons.edit}
                style={{height: 15, width: 15, tintColor: COLORS.lightblue_900}}
              />
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      );
    };
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            backgroundColor: COLORS.lightblue_800,
            ...styles.cartItemContainer,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.lightGray2,
                }}>
                {index + 1}
                {' -'}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.lightGray2,
                  marginLeft: 5,
                  textTransform: 'capitalize',
                }}>
                {item.user_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: COLORS.lightGray1,
              marginTop: 5,
            }}></View>
          <View>
            {item.assign_works.map((ele, i) => {
              // console.log(ele);
              return (
                <Swipeable
                  key={ele._id}
                  renderRightActions={progress =>
                    renderRight(progress, ele._id)
                  }>
                  <View
                    style={{
                      marginTop: SIZES.base,
                      backgroundColor: COLORS.white,
                      padding: SIZES.base,
                      borderRadius: SIZES.base,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          ...FONTS.h5,
                          color: COLORS.black,
                        }}>
                        {ele.work_code}
                        <Text style={{color: COLORS.darkGray, ...FONTS.h5}}>
                          {' - '}
                          {ele.work}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          ...FONTS.h5,
                          color: COLORS.darkGray,
                        }}>
                        exp completion date: {ele.exp_completion_date}
                      </Text>
                      <TouchableOpacity onPress={() => console.log('revert')}>
                        <ImageBackground
                          style={{
                            backgroundColor: COLORS.warning_200,
                            padding: 5,
                            borderRadius: SIZES.padding,
                          }}>
                          <Image
                            source={icons.revert}
                            resizeMode="contain"
                            style={{
                              height: 10,
                              width: 10,
                              tintColor: COLORS.rose_600,
                            }}
                          />
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Swipeable>
              );
            })}
          </View>
        </View>
      );
    };
    const renderHiddenItem = ({item}) => {
      return (
        <View
          style={{
            // flex: 1,
            // height: 70,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: COLORS.lightblue_800,
            ...styles.cartItemContainer,
          }}>
          <IconButton
            containerStyle={{justifyContent: 'flex-end'}}
            icon={icons.edit}
            iconStyle={{
              height: 20,
              width: 20,
              right: 10,
            }}
            onPress={() => OnEdit(item._id)}
          />
          <IconButton
            containerStyle={{justifyContent: 'flex-end'}}
            icon={icons.delete_icon}
            iconStyle={{
              height: 20,
              width: 20,
            }}
            onPress={() => OnDeleteAssignWork(item._id)}
          />
        </View>
      );
    };

    return (
      <SwipeListView
        data={assignWorkData}
        keyExtractor={item => `${item._id}`}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingBottom: SIZES.padding * 2,
          marginBottom: SIZES.padding,
          paddingHorizontal: SIZES.radius,
        }}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        maxHeight={300}
        showsVerticalScrollIndicator={false}
        disableRightSwipe={true}
        rightOpenValue={-70}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
      />
    );
  }
  return (
    <View
      style={{
        marginTop: SIZES.padding,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightblue_900,
        ...styles.shadow,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: SIZES.padding,
          paddingTop: SIZES.radius,
        }}>
        <Text style={{...FONTS.h2, color: COLORS.lightGray1}}>
          Assign Works
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setFilterRoleModal(true)}>
            <Image
              source={icons.filter}
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.lightGray1,
              }}
            />
          </TouchableOpacity>
          {/* <Text
            style={{
              color: COLORS.lightblue_50,
              backgroundColor: COLORS.lightblue_900,
              paddingHorizontal: SIZES.base,
              paddingVertical: 2,
              borderRadius: SIZES.base,
            }}>
            25
          </Text> */}
        </View>
      </View>
      {renderSwipeList()}
      {renderRoleFilterModal()}
      {showWorkModal && (
        <WorkAssignModal
          isVisible={showWorkModal}
          onClose={() => setWorkModal(false)}
        />
      )}
      <ConformationAlert
        isVisible={deleteConfirm}
        onCancel={() => {
          setDeleteConfirm(false);
        }}
        title="Delete Assign Work"
        message="Are you sure want to delete this work ?"
        cancelText="Cancel"
        confirmText="Yes"
        onConfirmPressed={() => {
          OnDeleteAssignWorks();
        }}
      />
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
  cartItemContainer: {
    marginTop: SIZES.base,
    paddingVertical: SIZES.radius,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.base,
  },
});

export default AssignedWorks;
