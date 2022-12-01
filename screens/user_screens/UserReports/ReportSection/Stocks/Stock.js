import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  Animated,
  Pressable,
  TextInput,
  FlatList,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import styles from '../../ReportStyle.js';
import {Title, Divider} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  get_stock_item_name,
  insert_stock_data,
  get_stock_data,
} from '../../ReportApi.js';

import moment from 'moment';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../../../constants';
import {
  FormInput,
  TextButton,
  HeaderBar,
  CustomToast,
} from '../../../../../Components';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Stock = ({project_id, Main_drp_pro_value, loading}) => {
  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    body_ed_de_view,
    dropdown,
    dropdown1,
    container,
    inputContainer,
    inputsContainer,
    inputfrom,
    inputfromtwo,
    inputfromone,
    cont_Project_list_drop,
  } = styles;

  //Stock collapse
  const [stockCollapse, setStockCollapse] = useState(false);
  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = useState(false);
  const [updateToast, setUpdateToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);
  const [stockResponseStatus, setStockResponseStatus] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const current_dat = moment().format('YYYY%2FMM%2FDD');

  let MyDateString = current_dat;

  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });
  //Insertion modal
  const [stockReportModal, setStockReportModal] = useState(false);
  const [addNewMaterial, setAddNewMaterial] = useState(false);
  const userCompanyData = useSelector(state => state.user);
  const [stockItemData, setStockItemData] = useState([]);

  const [materialItemName, setMaterialItemName] = useState('');
  const [getStockData, setGetStockData] = useState([]);

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    setTimeout(() => {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 150);
  };
  // all input fields
  const [stockEntry, setStockEntry] = useState([
    {
      item_id: '',
      unit_name: '',
      qty: '',
      vehicle_no: '',
      location: '',
    },
  ]);

  const [selectKey, setSelectKey] = useState('');

  const getStockDataItems = async () => {
    try {
      const data = await get_stock_item_name();
      setStockItemData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    getStockDataItems();
  }, [userCompanyData.company_id, loading]);

  const GetStockData = async () => {
    try {
      const data = await get_stock_data(
        userCompanyData.company_id,
        MyDateString,
      );
      const res = await data.json();
      if (res.status == 200) {
        // res.data.map(ele => {
        setGetStockData(res.data);
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    let isMount = true;
    GetStockData();
    return () => {
      isMount = false;
    };
  }, [userCompanyData.company_id, loading]);

  const postStockDataItems = async () => {
    try {
      const stock_post_data = {
        company_id: userCompanyData.company_id,
        project_id: project_id,
        user_id: userCompanyData._id,
        stockEntry: stockEntry,
      };

      if (stock_post_data) {
        const data = await insert_stock_data(stock_post_data);
        setStockResponseStatus(data);
        if (data.status == '200') {
          setSubmitToast(true);
          GetStockData();
          setTimeout(() => {
            setStockReportModal(false);
            setSubmitToast(false);
          }, 900);
          stockEntry.splice(0, stockEntry.length);
        }
      } else {
        alert('Not inserted');
      }
    } catch (error) {}
  };

  const inputUnitName = (text, key) => {
    const _inputs = [...stockEntry];
    _inputs[key].unit_name = text;
    _inputs[key].key = key;
    setStockEntry(_inputs);
  };
  const inputQuantity = (text, key) => {
    const _inputs = [...stockEntry];
    _inputs[key].qty = text;
    _inputs[key].key = key;
    setStockEntry(_inputs);
  };
  const inputVehicleNo = (text, key) => {
    const _inputs = [...stockEntry];
    _inputs[key].vehicle_no = text;
    _inputs[key].key = key;
    setStockEntry(_inputs);
  };
  const inputLocation = (text, key) => {
    const _inputs = [...stockEntry];
    _inputs[key].location = text;
    _inputs[key].key = key;
    setStockEntry(_inputs);
  };

  const inputSelectItem = (item, key) => {
    const _inputs = [...stockEntry];
    _inputs[key].item_id = item._id;
    _inputs[key].unit_name = item.unit_name;
    _inputs[key].key = key;
    setStockEntry(_inputs);
  };

  const deleteStockHandler = key => {
    const _inputs = [...stockEntry];
    _inputs.splice(key, 1);
    setStockEntry(_inputs);
  };

  const addStockInputHandler = () => {
    setStockEntry([
      ...stockEntry,
      {item_id: '', unit_name: '', qty: '', location: '', vehicle_no: ''},
    ]);
  };

  const add_stock_input = () => {
    return (
      <View style={container}>
        <ScrollView style={inputsContainer}>
          {stockEntry
            ? stockEntry.map((input, key) => {
                return (
                  <View
                    style={[
                      inputsContainer,
                      {
                        borderWidth: 1,
                        borderColor: COLORS.lightGray1,
                        borderRadius: 2,
                        elevation: 2,
                        padding: 10,
                        margin: 5,
                      },
                    ]}
                    key={key}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                      }}
                      key={key}>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          // cont_Project_list_drop,
                          isFocus && {borderColor: 'blue'},
                        ]}
                        selectedTextStyle={{color: COLORS.gray}}
                        placeholderStyle={{
                          fontSize: 16,
                          color: COLORS.gray,
                          left: 5,
                        }}
                        inputSearchStyle={{
                          color: COLORS.gray,
                          height: 40,
                          borderRadius: 5,
                          padding: -5,
                        }}
                        data={stockItemData}
                        search
                        maxHeight={300}
                        labelField="item_name"
                        valueField="_id"
                        placeholder={!isFocus ? 'Select' : '...'}
                        searchPlaceholder="Search..."
                        value={input.item_id}
                        onChange={item => {
                          setSelectKey(input.key);
                          inputSelectItem(item, key);
                        }}
                      />
                      <TextInput
                        style={inputfromtwo}
                        selectTextOnFocus={false}
                        placeholder={'unit name'}
                        // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
                        value={
                          key == selectKey ? input.unit_name : input.unit_name
                        }
                        onChangeText={text => {
                          inputUnitName(text, key);
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        style={[inputfromone, {width: '27%'}]}
                        placeholder="Qty"
                        keyboardType="numeric"
                        placeholderTextColor={COLORS.gray}
                        value={input.qty}
                        onChangeText={text => {
                          inputQuantity(text, key);
                        }}
                      />
                      <TextInput
                        style={[inputfromone, {width: '28%'}]}
                        placeholder="Vehicle no"
                        placeholderTextColor={COLORS.gray}
                        value={input.vehicle_no}
                        onChangeText={text => {
                          inputVehicleNo(text, key);
                        }}
                      />
                      <TextInput
                        style={[inputfromone, {width: '40%'}]}
                        placeholder="Location"
                        placeholderTextColor={COLORS.gray}
                        value={input.location}
                        onChangeText={text => {
                          inputLocation(text, key);
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        style={{
                          elevation: 8,
                          borderColor: COLORS.transparent,
                        }}
                        onPress={() => deleteStockHandler(key)}>
                        <Image
                          source={icons.delete_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.red,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    );
  };

  const add_stock_data_modal = () => {
    return (
      <Modal
        visible={stockReportModal}
        transparent={false}
        animationType="slide">
        <View style={{flex: 1, backgroundColor: COLORS.transparentBlack1}}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View
              style={{
                height: '90%',
                width: '100%',
                backgroundColor: '#fff',
                marginTop: 90,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 22,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  justifyContent: 'space-between',
                }}>
                <Title>Add Stock Data</Title>
                <Pressable
                  onPress={() => {
                    // inputs.splice(0, inputs.length);
                    setStockReportModal(false);
                  }}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 2,
                    margin: 5,
                    borderRadius: 1,
                    elevation: 1,
                    borderColor: COLORS.transparent,
                  }}
                  onPress={() => {
                    addStockInputHandler();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 1,
                    }}>
                    <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                      Add Existing Material
                    </Text>
                    <MaterialIcons
                      name="add-box"
                      size={20}
                      color={COLORS.green}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 4,
                    margin: 5,
                    borderRadius: 1,
                    elevation: 1,
                    borderColor: COLORS.transparent,
                  }}
                  onPress={() => {
                    setAddNewMaterial(true);
                  }}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Add New Material
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>{add_stock_input()}</View>
              {/* <Button
                                title="submit"
                                onPress={() => {
                                    postStockDataItems();
                                }}
                            /> */}
              <TextButton
                label="Submit"
                buttonContainerStyle={{
                  height: 55,
                  width: '100%',
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightblue_700,
                }}
                onPress={() => {
                  postStockDataItems();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const add_new_material_modal = () => {
    return (
      <View>
        <Modal
          transparent={false}
          visible={addNewMaterial}
          animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 80,
                padding: 20,
                borderRadius: 8,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.h2, color: COLORS.darkGray}}>
                  Add New Material
                </Text>
                <Pressable onPress={() => setAddNewMaterial(false)}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View style={{marginTop: 20}}>
                <FormInput
                  label="Name"
                  onChange={text => {
                    setMaterialItemName(text);
                  }}
                />
              </View>
              <View>
                <TextButton
                  label="save"
                  buttonContainerStyle={{
                    height: 45,
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.padding,
                  }}
                  onPress={() => {
                    // saveNewMaterial();
                  }}
                />
              </View>
              {/* <Toast config={showToastItem} /> */}
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const add_stock_icon_button = () => {
    return (
      <Animated.View style={{transform: [{scale}]}}>
        <TouchableOpacity
          style={{
            // backgroundColor: COLORS.white,
            borderRadius: SIZES.radius * 0.2,
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: 2,
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => {
            stockEntry.splice(0, stockEntry.length);
            setStockReportModal(true);
          }}>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              position: 'absolute',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              backgroundColor: COLORS.lightblue_400,
              padding: SIZES.base * 0.1,
              paddingHorizontal: 2,
              paddingVertical: -2,
              borderRadius: 5,
              top: -SIZES.base * 1.2,
            }}>
            <View>
              <Text
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[FONTS.body5, {color: COLORS.white}]}>
                Add
              </Text>
            </View>
            <View>
              <MaterialIcons name="add" size={15} color={COLORS.white} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  const ListHeader = () => {
    return (
      <View style={[styles1.headerFooterStyle, styles1.shadow]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 150, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Voucher Type
            </Text>
          </View>
          <View style={{width: 80, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Item Name
            </Text>
          </View>
          <View style={{width: 80, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Qty
            </Text>
          </View>
          <View style={{width: 120, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Unit Name
            </Text>
          </View>
          <View style={{width: 200, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Remark
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderStock = ({item}) => (
    <View>
      {item.voucherData.map((ele, i) => {
        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              margin: 1,
              borderWidth: 0.05,
              marginVertical: SIZES.base * 0.5,
            }}>
            <View style={{width: 150}}>
              <Text style={{fontSize: 16, textAlign: 'left'}}>
                {ele.voucher_type}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 80}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.item_name}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 60}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>{ele.qty}</Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 120}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.unit_name}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 200}}>
              <Text style={{fontSize: 16, textAlign: 'left'}}>
                {ele.remark}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
          </View>
        );
      })}
    </View>
  );

  return (
    <View>
      <Animated.View style={{transform: [{scale}]}}>
        <Pressable
          onPress={() => {
            GetStockData();
            LayoutAnimation.configureNext({
              duration: 300,
              create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
              update: {
                type: LayoutAnimation.Types.easeInEaseOut,
              },
            });
            setStockCollapse(!stockCollapse);
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            paddingVertical: 3,
            width: SIZES.width * 0.53,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: SIZES.base * 2,
            borderColor: COLORS.lightblue_200,
            backgroundColor: COLORS.lightblue_600,
            borderWidth: 1,
            borderRadius: 4,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}>
          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <Text
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                Main_drp_pro_value ? null : alert('Select Project First!');
                setStockCollapse(!stockCollapse);
                LayoutAnimation.configureNext({
                  duration: 300,
                  create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                  },
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });
              }}
              style={[FONTS.h3, {color: COLORS.white2}]}>
              Stock
            </Text>
          </View>
          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                LayoutAnimation.configureNext({
                  duration: 300,
                  create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                  },
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });
                setStockCollapse(!stockCollapse);
              }}>
              <AntDesign name="caretdown" size={12} color={COLORS.white2} />
            </TouchableOpacity>
          </View>
        </Pressable>
        <View style={{left: 60}}>
          {stockCollapse ? add_stock_icon_button() : null}
        </View>
      </Animated.View>

      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        {stockCollapse ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginTop: 5, top: 20}}>
                {
                  <FlatList
                    data={getStockData}
                    horizontal
                    contentContainerStyle={{
                      flexDirection: 'column',
                      padding: 2,
                      marginHorizontal: 2,
                      paddingBottom: 20,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderStock}
                    ListHeaderComponent={ListHeader}
                    keyExtractor={item => item._id.toString()}
                  />
                }
              </View>
            </ScrollView>
          </View>
        ) : null}
        {add_new_material_modal()}
        {add_stock_data_modal()}
      </View>

      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Submit"
        message="Submitted Successfully..."
      />
      <CustomToast
        isVisible={updateToast}
        onClose={() => setUpdateToast(false)}
        color={COLORS.yellow_400}
        title="Update"
        message="Updated Successfully..."
      />
      <CustomToast
        isVisible={deleteToast}
        onClose={() => setDeleteToast(false)}
        color={COLORS.rose_600}
        title="Delete"
        message="Deleted Successfully..."
      />
    </View>
  );
};

export default Stock;

const styles1 = StyleSheet.create({
  headerFooterStyle: {
    width: '100%',
    borderWidth: 0.1,
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    padding: 7,
  },
});
