import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import FilePicker, {types} from 'react-native-document-picker';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {
  IconButton,
  CustomDropdown,
  TextButton,
  CustomToast,
} from '../../../Components';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {getUserRole, roleByUser} from '../../../controller/UserRoleController';
import {postAssignWork} from '../../../controller/AssignWorkController';

const WorkAssignModal = ({projectId, isVisible, onClose}) => {
  const companyData = useSelector(state => state.company);

  //ADD DYNAMICALLY INPUT FEILD
  const [work, setWork] = React.useState([{key: '', value: ''}]);
  const [newWork, setNewWork] = React.useState([]);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  //GETTING USER ROLES FROM API
  const [openUserRole, setOpenUserRole] = React.useState(false);
  const [userRoleValue, setUserRoleValue] = React.useState([]);
  const [userRoles, setUserRoles] = React.useState([]);

  //GETTING USER FROM APIS ON CHANGE OF USER ROLES
  const [openUsers, setOpenUsers] = React.useState(false);
  const [usersValue, setUsersValue] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const addHandler = () => {
    const inputs = [...work];
    inputs.push({key: '', value: ''});
    setWork(inputs);
  };

  const removeHandler = key => {
    const inputs = work.filter((input, index) => index != key);
    setWork(inputs);
  };

  const assignWorkArr = [];
  const inputHandler = (text, key) => {
    const inputs = [...work];
    inputs[key].value = text;
    inputs[key].key = key;
    setWork(inputs);

    work.map((item, i) => {
      assignWorkArr.push(item.value);
      setNewWork(assignWorkArr);
    });

    // CLOSE DROPDOWN ON OPEN ANOTHER DROPDOWN
    const onRoleOpen = React.useCallback(() => {
      setOpenUsers(false);
    }, []);

    const onUserOpen = React.useCallback(() => {
      setOpenUserRole(false);
    }, []);

    //=================================== Apis ===================================

    const getUserRoles = async () => {
      let response = await getUserRole();
      if (response.status === 200) {
        let roleDataFromApi = response.data.map((one, i) => {
          return {label: one.user_role, value: one._id};
        });
        setUserRoles(roleDataFromApi);
      }
    };

    const getUserByRoleId = async role_id => {
      let response = await roleByUser(role_id);
      if (response.status === 200) {
        let roleDataFromApi = response.data.map(ele => {
          return {label: ele.name, value: ele._id};
        });
        setUsers(roleDataFromApi);
      }
    };

    const postAssignWorks = async () => {
      const formData = {
        role_id: userRoleValue,
        user_id: usersValue,
        work: newWork,
        exp_completion_date: formatedDate,
        exp_completion_time: formatedTime,
        company_id: companyData._id,
        project_id: projectId,
      };
      console.log(formData);
      let response = await postAssignWork(formData);
      console.log(response);
      if (response.status === 200) {
        setSubmitToast(true);
        onClose();
        setUsersValue('');
        setUserRoleValue('');
        setNewWork('');
      } else {
        alert(response.message);
      }
      setTimeout(() => {
        setSubmitToast(false);
      }, 1500);
    };

    React.useEffect(() => {
      getUserRoles();
    }, []);

    // DOCUMENT PICKER
    // const [fileData, setFileData] = React.useState([]);
    // const handleFilePicker = () => {
    //   try {
    //     const response = FilePicker.pick({
    //       presentationStyle: 'fullScreen',
    //       allowMultiSelection: true,
    //       type: [types.images, types.pdf, types.plainText],
    //     });
    //     setFileData(response);
    //     console.log(response);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // DATE & TIME
    const [date, setDate] = React.useState(new Date());
    const formatedDate = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ' ' + ampm;
    const formatedTime = strTime;

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };

    const showMode = currentMode => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        locale: 'en-IN',
        display: 'spinner',
      });
    };

    const showDatepicker = () => {
      showMode('date');
    };

    const showTimepicker = () => {
      showMode('time');
    };

    function renderStartDate() {
      return (
        <View
          style={{
            flexDirection: 'row',
            borderRadius: SIZES.base,
            backgroundColor: COLORS.gray3,
            paddingHorizontal: SIZES.radius,
            paddingVertical: SIZES.base,
            // ...styles.shadow,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.darkGray,
                }}>
                Date - {date.toLocaleDateString()}
              </Text>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.darkGray,
                  left: 10,
                }}>
                Time - {date.toLocaleTimeString()}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={showDatepicker}>
                <Image
                  source={icons.date}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.lightblue_900,
                    right: 8,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={showTimepicker}>
                <Image
                  source={icons.time}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.lightblue_900,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View>
        <Modal animationType="fade" transparent={true} visible={isVisible}>
          <View style={{flex: 1, backgroundColor: COLORS.transparentBlack7}}>
            {/* transparent background */}
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}></View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={{
                position: 'absolute',
                left: SIZES.padding,
                top: 100,
                // top: modalY,
                width: '90%',
                // height: '65%',
                maxHeight: 400,
                padding: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
              }}>
              {/* header */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex: 1, ...FONTS.h2, color: COLORS.darkGray}}>
                  Assign Work
                </Text>
                <IconButton
                  containerStyle={{
                    boborderWidth: 2,
                    borderRadius: 10,
                    borderColor: COLORS.gray2,
                  }}
                  icon={icons.cross}
                  iconStyle={{
                    tintColor: COLORS.gray,
                  }}
                  onPress={onClose}
                />
              </View>
              {/* <WorkAssign /> */}

              <ScrollView showsVerticalScrollIndicator={false}>
                <CustomDropdown
                  placeholder="Select"
                  open={openUserRole}
                  value={userRoleValue}
                  items={userRoles}
                  setOpen={setOpenUserRole}
                  setValue={setUserRoleValue}
                  setItems={setUserRoles}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  onChangeValue={value => getUserByRoleId(value)}
                  // onSelectItem={value => console.log(value)}
                  onOpen={onRoleOpen}
                  zIndex={2000}
                  zIndexInverse={1000}
                  // maxHeight={150}
                />
                <CustomDropdown
                  placeholder="Select"
                  open={openUsers}
                  value={usersValue}
                  items={users}
                  setOpen={setOpenUsers}
                  setValue={setUsersValue}
                  setItems={setUsers}
                  // categorySelectable={true}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  zIndex={1000}
                  zIndexInverse={2000}
                  onOpen={onUserOpen}
                />

                <View
                  style={{
                    // flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {/* <ScrollView> */}
                  {work.map((input, key) => (
                    <View style={{}} key={key}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            color: COLORS.darkGray,
                            ...FONTS.body4,
                            marginTop: SIZES.radius,
                          }}>
                          Work {key + 1}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: key == 0 ? '90%' : '82%',
                            height: 40,
                            paddingHorizontal: SIZES.padding,
                            borderRadius: SIZES.base,
                            backgroundColor: COLORS.gray3,
                            right: 3,
                          }}>
                          <TextInput
                            style={{color: COLORS.black}}
                            placeholder="Write here..."
                            placeholderTextColor={COLORS.darkGray}
                            value={input.value}
                            onChangeText={text => inputHandler(text, key)}
                          />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => removeHandler(key)}>
                            {key != 0 && (
                              <Image
                                source={icons.minus1}
                                style={{
                                  height: 25,
                                  width: 25,
                                  right: 2,
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity onPress={addHandler}>
                            <Image
                              source={icons.plus1}
                              style={{
                                height: key == 0 ? 25 : 25,
                                width: key == 0 ? 25 : 25,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                  {/* </ScrollView> */}
                </View>
                <View style={{marginTop: SIZES.radius}}>
                  {renderStartDate()}
                </View>
                {/* <Text
              style={{
                marginTop: SIZES.radius,
                ...FONTS.body4,
                color: COLORS.darkGray,
                // marginLeft: SIZES.base,
              }}>
              Upload files
              </Text>
              <View
              style={{
                borderRadius: SIZES.base,
                backgroundColor: COLORS.gray3,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.base,
              }}>
              <View style={{}}>
              {fileData.length > 0
                ? fileData.map((list, index) => {
                  return (
                    <View key={index}>
                    <Text
                    style={{
                      ...FONTS.body4,
                      color: COLORS.lightblue_900,
                    }}>
                    {index + 1}.{''} {list.name}
                    </Text>
                    </View>
                    );
                  })
                  : null}
                  </View>
                  <TouchableOpacity
                  onPress={handleFilePicker}
                  style={{alignItems: 'flex-end'}}>
                  <Image
                  source={icons.upload_files}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: COLORS.black,
                  }}
                />
                </TouchableOpacity>
              </View> */}

                <TextButton
                  label="Submit"
                  buttonContainerStyle={{
                    height: 50,
                    alignItems: 'center',
                    marginTop: SIZES.padding * 1.5,
                    borderRadius: SIZES.radius,
                  }}
                  onPress={() => postAssignWorks()}
                />
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
        <CustomToast
          isVisible={submitToast}
          onClose={() => setSubmitToast(false)}
          color={COLORS.green}
          title="Submit"
          message="Submitted Successfully..."
        />
      </View>
    );
  };
};
export default WorkAssignModal;
