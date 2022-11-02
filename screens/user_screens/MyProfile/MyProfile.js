import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';
import {HeaderBar, TextButton, FormInput} from '../../../Components';
import {Title, Card} from 'react-native-paper';
import {SIZES, COLORS, icons, FONTS, images} from '../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getUserAttendance} from '../../../controller/UserAttendanceController';

import CustomCalender from './CustomCalender';

import {useSelector, useDispatch} from 'react-redux';
import {Popable} from 'react-native-popable';
import config from '../../../config';
// import CalendarPicker from 'react-native-calendar-picker';
import Collapsible from 'react-native-collapsible';
import DropDownPicker from 'react-native-dropdown-picker';

const MyProfile = () => {
  const userData = useSelector(state => state.user);
  const user_id = userData._id;

  const [leavesmodal, setLeavesModal] = useState(false);
  const [leavesdate, setLeavesDate] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [userDetail, setUserDetail] = useState([]);
  const [showleaves, setShowLeaves] = useState([]);
  const [monthshow, setMonthShow] = useState([]);
  const [leavesday, setLeavesDay] = useState([]);
  const [haliddayates, setHalidayDates] = useState([]);
  const [loginTime, setLoginTime] = useState('');
  const [logoutTime, setLogoutTime] = useState('');

  const [attendance, setAttendance] = React.useState('');
  // console.log(userDetail);
  // const [removedate, setRemoveDate] = useState(false)
  const [pushdate, setPushDate] = useState([]);

  const {
    calendarRows,
    selectedDate,
    todayFormatted,
    daysShort,
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = CustomCalender();
  // console.log(todayFormatted)

  useEffect(() => {
    fetch(`${process.env.API_URL}user/${userData._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Bearer ${userData.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserDetail(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const userAttendance = async () => {
    let response = await getUserAttendance(userData._id, userData.company_id);
    response.data.map(ele => {
      let data = ele.presentdates;
      data.map(e => {
        let inTime = e.in_time;
        let outTime = e.out_time;

        // console.log(Time)
        setLoginTime(inTime);
        setLogoutTime(outTime);
      });
    });
    // setAttendance(response.data);
  };

  React.useEffect(() => {
    // userLeaves();
    userAttendance();
  }, []);

  // console.log(inTime)

  const dateClickHandler = (date, i) => {
    //  const newDate= removedate?[...leavesdate, date]:leavesdate.pop(date);
    const selectDate = [...leavesdate, date];
    // setLeavesDate(date=> [...leavesdate,  ${date.length}`]);
    // if(leavesdate){
    // const obj = [...new Map(
    // leavesdate.map(item => [JSON.stringify(item), item])).values()];
    // setPushDate(obj);
    // }
    setLeavesDate(selectDate);
    setSelectedId(i);
    const newselectdate = [...new Set(leavesdate), date];
    // console.log(newselectdate);
    setPushDate(newselectdate);
  };

  const submitLeaves = () => {
    const applyleaves = {
      leavedates: pushdate,
      user_id: user_id,
      company_id: userData.company_id,
    };
    // console.log(applyleaves)
    try {
      fetch(`${process.env.API_URL}apply-leaves`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applyleaves),
      })
        .then(response => response.json())
        .then(data => {
          showleavesdata();
          // console.log('Success:', data);
        });
    } catch (error) {
      console.error('Error:', error);
    }
    setLeavesModal(false);
  };

  // get data api leaves apply for user

  const showleavesdata = async () => {
    const resp = await fetch(process.env.API_URL + 'attendance/' + user_id);
    const leavesDate = await resp.json();
    setShowLeaves(leavesDate);
  };

  useEffect(() => {
    showleavesdata();
    userPresentDays();
  }, []);

  useMemo(() => {
    if (showleaves.data) {
      showleaves.data.map(ele => {
        // console.log(ele)
        setMonthShow(ele);
      });
    }
  }, [showleaves]);

  useMemo(() => {
    if (monthshow.months) {
      monthshow.months.map((month, index) => {
        setLeavesDay(month);
      });
    }
  }, [showleaves]);

  // useMemo(() => {
  //   if (leavesday.leavedays) {

  //      leavesday.leavedays.map((days,index)=> {
  //         console.log(days)
  //       // console.log(index)
  //       let dates = days.leave_date
  //         // console.log(dates)
  //       setHalidayDates(dates)
  //     });
  //   }
  // }, []);

  // console.log(haliddayates)

  const ClearDate = () => {
    setPushDate('');
    setLeavesDate('');
  };

  // const TodayDate = () => {

  // };

  var dt = new Date();

  var dt = new Date();

  var hours = dt.getHours(); // gives the value in 24 hours format
  var AmOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  var minutes = dt.getMinutes();
  // var finalTime = "Time  - " + hours + ":" + minutes + " " + AmOrPm;
  var finalTime = hours + ':' + minutes + AmOrPm;

  // saurabh
  const [collapsed1, setCollapsed1] = React.useState(true);
  const toggleExpanded1 = () => {
    setCollapsed1(!collapsed1);
  };
  const [attendancedDate, setAttendanceDate] = React.useState('');

  const [date, setDate] = React.useState(new Date());

  const [openMonths, setOpenMonths] = React.useState(false);
  const [monthsValue, setMonthsValue] = React.useState('');
  const [months, setMonths] = React.useState([
    {label: 'Jan', value: '01'},
    {label: 'Feb', value: '02'},
    {label: 'Mar', value: '03'},
    {label: 'Apr', value: '04'},
    {label: 'May', value: '05'},
    {label: 'Jun', value: '06'},
    {label: 'Jul', value: '07'},
    {label: 'Aug', value: '08'},
    {label: 'Sept', value: '09'},
    {label: 'Oct', value: '10'},
    {label: 'Nov', value: '11'},
    {label: 'Dec', value: '12'},
  ]);

  const currentYear = new Date().getFullYear();

  const [openYears, setOpenYears] = React.useState(false);
  const [yearsValue, setYearsValue] = React.useState('');
  const [years, setYears] = React.useState([
    {label: currentYear, value: currentYear},
    {label: currentYear - 1, value: currentYear - 1},
    {label: currentYear - 2, value: currentYear - 2},
  ]);

  const onYearOpen = () => {
    setOpenMonths(false);
  };

  const onMonthOpen = () => {
    setOpenYears(false);
  };

  const year = yearsValue == '' ? date.getFullYear() : yearsValue;
  const month =
    monthsValue == '' ? ('0' + (date.getMonth() + 1)).slice(-2) : monthsValue;

  const userPresentDays = async () => {
    let response = await getUserAttendance(
      userData.company_id,
      year,
      month,
      user_id,
    );
    setAttendanceDate(response.data);
  };

  function renderUserAttendance() {
    const renderItem = ({item}) => (
      <View>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
            textTransform: 'capitalize',
          }}>
          {item.user_name}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            // justifyContent:'space-evenly',
          }}>
          {item.presentdates.map((ele, i) => (
            <View
              key={i}
              style={{
                marginTop: 5,
                flexBasis: '20%',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.success_700,
                  padding: 5,
                  alignItems: 'center',
                  borderLeftWidth: i != 0 && i % 5 ? 5 : null,
                  borderColor: 'white',
                }}>
                <Text style={{fontSize: 9, color: COLORS.white}}>
                  {ele.present_date}
                </Text>
                <Text style={{fontSize: 8, color: COLORS.white}}>
                  In - {ele.in_time}
                </Text>
                <Text style={{fontSize: 8, color: COLORS.white}}>
                  Out - {ele.out_time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );

    return (
      <View
        style={{
          margin: 15,
          padding: 15,
          backgroundColor: COLORS.white,
          elevation: 5,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={toggleExpanded1}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Attendance</Text>
          <Image
            source={icons.down_arrow}
            style={{height: 20, width: 20, tintColor: 'black'}}
          />
        </TouchableOpacity>
        <Collapsible collapsed={collapsed1}>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 50,
            }}>
            <View style={{width: '45%'}}>
              <DropDownPicker
                style={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                  minHeight: 30,
                }}
                dropDownContainerStyle={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                }}
                placeholder="Year"
                open={openYears}
                value={yearsValue}
                items={years}
                setOpen={setOpenYears}
                setValue={setYearsValue}
                setItems={setYears}
                onChangeValue={userAttendance}
                maxHeight={80}
                onOpen={onYearOpen}
              />
            </View>
            <View style={{width: '45%'}}>
              <DropDownPicker
                style={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                  minHeight: 30,
                }}
                dropDownContainerStyle={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                }}
                placeholder="Month"
                open={openMonths}
                value={monthsValue}
                items={months}
                setOpen={setOpenMonths}
                setValue={setMonthsValue}
                setItems={setMonths}
                maxHeight={80}
                onChangeValue={userAttendance}
                onOpen={onMonthOpen}
              />
            </View>
          </View>
          <FlatList
            data={attendancedDate}
            contentContainerStyle={{
              // marginTop: SIZES.radius,
              paddingBottom: 20,
            }}
            keyExtractor={item => `${item._id}`}
            renderItem={renderItem}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            maxHeight={200}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.gray2,
                    marginVertical: 12,
                  }}></View>
              );
            }}
          />
        </Collapsible>
      </View>
    );
  }

  return (
    <ScrollView>
      <View
        style={{
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          ...styles.shadow,
          marginHorizontal: SIZES.radius,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          padding: 20,
          borderWidth: 1,
          elevation: 0.9,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Name:-{userDetail.name}
          </Text>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Designation:-{userDetail.role}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Email:-{userDetail.email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Emp_id:-{userDetail.role_id}
          </Text>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            {/* Join_Date:-{'20/08/2021'} */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Mobile-No:-{userDetail.mobile}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Leaves Date</Text>
          <TextButton
            label="Apply for leaves"
            buttonContainerStyle={{
              paddingHorizontal: SIZES.base,
              borderRadius: 5,
            }}
            // labelStyle={{...FONTS.h5}}
            onPress={() => setLeavesModal(true)}
          />
        </View>
        <View style={{marginTop: 5}}>
          {leavesday.leavedays != undefined
            ? leavesday.leavedays.map((Ldays, index) => {
                {
                  /* console.log(Ldays) */
                }
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {Ldays.leave_date}
                    </Text>

                    <TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          backgroundColor: 'orange',
                          marginTop: 2,
                          padding: 2,
                          margin: 2,
                        }}>
                        Pending
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            : null}
        </View>
        {/* leacves modal start  */}
      </View>

      <Modal transparent={false} visible={leavesmodal} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            // justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginTop: 50,
              padding: 10,
              borderRadius: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Title>Leaves from </Title>
              <Pressable onPress={setLeavesModal}>
                <AntDesign name="close" size={30} color="black" />
              </Pressable>
            </View>
            <View style={{marginTop: 10}}>
              <View>
                <Card style={{borderWidth: 2, elevation: 10, margin: 10}}>
                  <Card.Content>
                    <View>
                      {/* <Card style={{borderWidth: 2}}>
                        <Card.Content> */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Title>
                          {`${
                            monthNames[selectedDate.getMonth()]
                          }-${selectedDate.getFullYear()}`}
                        </Title>
                        {/* <Text>Today{todayFormatted}</Text> */}
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity onPress={getPrevMonth}>
                            <Text style={{marginRight: 10, fontSize: 18}}>
                              Prev
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={getNextMonth}>
                            <Text style={{fontSize: 18}}>Next</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* </Card.Content>
                      </Card> */}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        marginBottom: 15,
                        marginTop: 25,
                        // backgroundColor:COLORS.lightblue_700,
                      }}>
                      {daysShort.map((day, index) => (
                        // console.log(day,index)
                        <Title
                          style={[index == 6 ? {color: 'red'} : null]}
                          key={index}>
                          {day}
                        </Title>
                      ))}
                    </View>

                    {Object.values(calendarRows).map((cols, index) => {
                      // {console.log(cols)}
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                            // backgroundColor:"red"
                          }}>
                          {cols.map((col, i) =>
                            col.date === todayFormatted ? (
                              <TouchableOpacity
                                key={i}
                                style={[
                                  todayFormatted
                                    ? {
                                        backgroundColor: 'green',
                                        borderRadius: 50,
                                        paddingHorizontal: 10,
                                        marginLeft: -5,
                                      }
                                    : null,
                                ]}
                                onPress={() => {
                                  dateClickHandler({leave_date: col.date});
                                }}>
                                <Title style={{color: '#fff'}}>
                                  {col.value}
                                </Title>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                key={i}
                                className={col.classes}
                                onPress={() => {
                                  dateClickHandler({leave_date: col.date});
                                }}>
                                <Title
                                  style={[
                                    col.classes == 'in-prev-month'
                                      ? {opacity: 0.5}
                                      : col.classes == 'in-next-month'
                                      ? {opacity: 0.5}
                                      : i == 6
                                      ? {
                                          backgroundColor: 'orange',
                                          borderRadius: 50,
                                          paddingHorizontal: 5,
                                          marginLeft: -5,
                                        }
                                      : col.date == leavesdate[i]
                                      ? {
                                          backgroundColor: 'red',
                                          borderRadius: 50,
                                          paddingHorizontal: 5,
                                          marginLeft: -5,
                                          color: '#fff',
                                        }
                                      : {
                                          backgroundColor: COLORS.gray3,
                                          borderRadius: 50,
                                          paddingHorizontal: 5,
                                          marginLeft: -5,
                                        },
                                  ]}>
                                  {col.value}
                                </Title>
                              </TouchableOpacity>
                            ),
                          )}
                        </View>
                      );
                    })}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 5,
                      }}>
                      {/* <Button title='Today'onPress={()=>{TodayDate()}} /> */}
                      <Button
                        title="clear"
                        onPress={() => {
                          ClearDate();
                        }}
                      />
                    </View>
                  </Card.Content>
                </Card>
              </View>
            </View>
            <View>
              <TextButton
                label="Apply"
                buttonContainerStyle={{
                  height: 45,
                  borderRadius: SIZES.radius,
                  marginTop: SIZES.padding,
                }}
                onPress={() => submitLeaves()}
              />
              <View>
                {/* <Title>{JSON.stringify(leavesdate)}</Title> */}
                <Title>{JSON.stringify(pushdate)}</Title>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* modal end  */}

      {renderUserAttendance()}
    </ScrollView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({});
