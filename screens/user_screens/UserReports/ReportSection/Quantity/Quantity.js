import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Button,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Animated,
} from 'react-native';
import {Title, Divider} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../ReportStyle.js';
import {
  Insert_report_data,
  Get_report_data,
  edit_report_data,
  check_quantity_item_exist,
  update_quantity_data,
  get_quality_type,
  delete_Qty_Record,
  get_latest_steel_id,
  get_latest_painting_id,
  get_latest_floor_id,
  get_latest_plaster_id,
} from '../../ReportApi.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
  constants,
} from '../../../../../constants';
import {
  FormInput,
  TextButton,
  HeaderBar,
  DeleteConfirmationToast,
  CustomToast,
} from '../../../../../Components';

const Quantity = ({project_id, Main_drp_pro_value, loading}) => {
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

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  // const STEEL_CONST=0.00616;
  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

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

  // state
  const [quantityitem, setquantityitem] = useState('');
  const [value, setvalue] = useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  // modal
  const [additem, setadditem] = useState(false);
  const [reportmodal, setReportmodal] = useState(false);
  const [data, setdata] = useState([]);
  const [reportdata, setReportdata] = useState([]);
  // qtytotal
  // console.log(qtyTotal)

  //Quantity collapse
  const [quant_ity, setQuantity] = useState(false);
  //key states of dynamic inputs
  const [selectKey, setSelectKey] = useState('');
  const [steelItem, setSteelItem] = useState('');
  const [floringItem, setFloringItem] = useState('');
  const [paintingItem, setPaintingItem] = useState('');
  const [plasterItem, setPlasterItem] = useState('');
  const [lengthKey, selectLengthkey] = useState('');
  const [steelMMKey, setSteelMMkey] = useState('');
  const [nosKey, setNoskey] = useState('');
  const [widthKey, selectWidthkey] = useState('');
  const [heightKey, selectHeightkey] = useState('');

  //setting Main input data to post
  const [itemData, setItemData] = useState(reportdata.data);
  const [companyIdData, setCompanyIdData] = useState('');
  const [removeAddOnEdit, setRemoveAddOnEdit] = useState(false);
  // const [editReportData, setEditReportData] = useState('')
  const [updateId, setUpdateId] = useState('');
  const [saveItemsStatus, setSaveItemsStatus] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  const [deleteQtyId, setDeleteQtyId] = useState('');

  //setting post qty data  status
  const [postQtyData, setPostQtyData] = useState('');
  //main get report data
  const [getRepPostData, setGetRepPostData] = useState('');

  const [qualityType, setQualityType] = useState([]);

  //sub key states of dynamic inputs
  const [subLengthKey, setSubLengthkey] = useState('');
  const [subWidthKey, setSubWidthkey] = useState('');
  const [subHeightKey, setSubHeightkey] = useState('');
  const [subNosKey, setSubNoskey] = useState('');
  const [subSteelMmKey, setSubSteelMmkey] = useState('');

  const [unitKey, setUnitKey] = useState('');

  const [inputs, setInputs] = useState([
    {
      item_id: '',
      nos: '',
      steel_mm: '',
      num_length: '',
      num_width: '',
      num_height: '',
      num_total: '',
      remark: '',
      unit_name: '',
      quality_type: '',
      subquantityitems: [
        // { num_length: '', num_width: '', num_height: '', num_total: '', Remark: '', }
      ],
    },
  ]);

  const addKeyref = useRef(0);

  const userData = useSelector(state => state.user);

  const current_dat = moment().format('YYYY%2FMM%2FDD');

  const inputkeyRef = useRef(inputs);

  const CONST_FIELD = {
    MANPOWER: 'Manpower',
    STOCK: 'Stock',
    QUANTITY: 'Quantity',
    QUALITY: 'Quality',
    TANDP: 'Tandp',
  };

  //Invoking Report data functions in Report api
  const insertQtyPostData = () => {
    const report_post_data = {
      company_id: companyIdData,
      project_id: project_id,
      user_id: userData._id,
      inputs,
    };

    if (report_post_data) {
      const data = Insert_report_data(report_post_data, CONST_FIELD);
      data
        .then(res => res.json())
        .then(resp => {
          setPostQtyData(resp);
          getReportData();
          if (resp.status == '200') {
            setSubmitToast(true);
            // getRreportData()
            setTimeout(() => {
              setReportmodal(false);
              setSubmitToast(false);
            }, 900);
            inputs.splice(0, inputs.length);
          }
        });
    } else {
      alert('Not inserted');
    }
  };

  const updateQuantityData = async () => {
    const resp = {
      inputs,
    };

    const data = await update_quantity_data(updateId, resp);
    setUpdateStatus(data);

    if (data.status == '200') {
      setUpdateToast(true);
      setTimeout(() => {
        setReportmodal(false);
        setUpdateToast(false);
      }, 900);
      inputs.splice(0, inputs.length);
    }
  };

  const getQualityType = async () => {
    if (qualityType.length == 0) {
      const data = await get_quality_type();
      qualityType.push(...data.data);
    }
  };

  async function getReportData() {
    if (Main_drp_pro_value || postQtyData || updateStatus || loading) {
      const data = await Get_report_data(
        Main_drp_pro_value,
        userData._id,
        current_dat,
      );

      if (data.status == 200) {
        setGetRepPostData(data);
      } else {
        console.log('data not found!');
      }
    }
  }

  useEffect(() => {
    getReportData();
    getQualityType();
  }, [postQtyData, Main_drp_pro_value, updateStatus, loading]);

  const editReportBtn = async id => {
    setItemData(reportdata.data);
    inputs.splice(0, inputs.length);
    setRemoveAddOnEdit(true);
    setReportmodal(true);

    if (id) {
      const data = edit_report_data(id);
      setUpdateId(id);
      data
        .then(res => res.json())
        .then(result => {
          if (result.data.subquantityitems.length == 0) {
            setInputs([
              ...inputs,
              {
                item_id: result.data.item_id,
                nos: result.data.nos ? result.data.nos.toString() : '0',
                steel_mm: result.data.steel_mm
                  ? result.data.steel_mm.toString()
                  : '0',
                num_length: result.data.num_length
                  ? result.data.num_length.toString()
                  : '0',
                num_width: result.data.num_width
                  ? result.data.num_width.toString()
                  : '0',
                num_height: result.data.num_height
                  ? result.data.num_height.toString()
                  : '0',
                num_total: result.data.num_total.toString(),
                remark: result.data.remark,
                unit_name: result.data.unit_name,
                quality_type: result.data.quality_type,
                subquantityitems: [],
              },
            ]);
          } else {
            setInputs([
              ...inputs,
              {
                item_id: result.data.item_id,
                nos: result.data.nos ? result.data.nos.toString() : '0',
                steel_mm: result.data.steel_mm
                  ? result.data.steel_mm.toString()
                  : '0',
                num_length: result.data.num_length
                  ? result.data.num_length.toString()
                  : '0',
                num_width: result.data.num_width
                  ? result.data.num_width.toString()
                  : '0',
                num_height: result.data.num_height
                  ? result.data.num_height.toString()
                  : '0',
                num_total: result.data.num_total.toString(),
                remark: result.data.remark,
                unit_name: result.data.unit_name,
                quality_type: result.data.quality_type,
                subquantityitems:
                  // [
                  result.data.subquantityitems.map(ele => {
                    return {
                      sub_nos: ele.sub_nos ? ele.sub_nos.toString() : '0',
                      sub_height: ele.sub_height
                        ? ele.sub_height.toString()
                        : '0',
                      sub_length: ele.sub_length
                        ? ele.sub_length.toString()
                        : '0',
                      sub_remark: ele.sub_remark,
                      sub_total: ele.sub_total.toString(),
                      sub_width: ele.sub_width ? ele.sub_width.toString() : '0',
                      sub_quality_type: ele.sub_quality_type,
                      sub_steel_mm: ele.sub_steel_mm
                        ? ele.sub_steel_mm.toString()
                        : '0',
                    };
                  }),
                // ]
              },
            ]); //setinput close
          } //else close
        });
    } //main if close
  };

  const deleteReportButton = async () => {
    const res = await delete_Qty_Record(deleteQtyId);
    if (res.status === 200) {
      setTimeout(() => {
        setDeleteConfirm(false);
      }, 300);
      getReportData();
    }
  };

  const reportdataitem = async () => {
    try {
      const resp = await fetch(
        `${process.env.API_URL}quantity-report-item/` +
          `${userData.company_id}`,
      );
      const quantitydata = await resp.json();
      setReportdata(quantitydata);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    if (userData.company_id || saveItemsStatus || loading) {
      reportdataitem();
    }
  }, [userData.company_id, saveItemsStatus, loading]);

  const getLatestSteelId = async () => {
    try {
      const temp_id = await get_latest_steel_id(userData.company_id);
      if (temp_id.data) {
        setSteelItem(temp_id.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFloorId = async () => {
    try {
      const temp_id = await get_latest_floor_id(userData.company_id);
      if (temp_id.data) {
        setFloringItem(temp_id.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPaintingId = async () => {
    try {
      const temp_id = await get_latest_painting_id(userData.company_id);
      if (temp_id.data) {
        setPaintingItem(temp_id.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPlasterId = async () => {
    try {
      const temp_id = await get_latest_plaster_id(userData.company_id);
      if (temp_id.data) {
        setPlasterItem(temp_id.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkQuantityItemExist = async () => {
    const result1 = await check_quantity_item_exist(
      Main_drp_pro_value,
      userData._id,
      current_dat,
    );
    if (result1.status != 401 && result1.data.length > 0) {
      let result = reportdata.data.filter(function ({_id}) {
        return !this.has(_id);
      }, new Set(result1.data.map(({item_id}) => item_id)));
      setItemData(result);
    } else {
      reportdataitem();
      setItemData(reportdata.data);
    }
  };

  const addHandler = async () => {
    setPaintingItem('');
    setFloringItem('');
    setPlasterItem('');
    getLatestSteelId();
    getPaintingId();
    getFloorId();
    getPlasterId();
    checkQuantityItemExist();

    setInputs([
      ...inputs,
      {
        item_id: '',
        nos: '',
        steel_mm: '',
        num_length: '',
        num_width: '',
        num_height: '',
        num_total: '',
        remark: '',
        unit_name: '',
        quality_type: '',
        subquantityitems: [
          // { num_length: '', num_width: '', num_height: '', total: '', remark: '' }
        ],
      },
    ]);
  };

  const deleteHandler = key => {
    // const _inputs = inputs.filter((input, index) => index != key);
    const _inputs = [...inputs];
    _inputs.splice(key, 1);
    setInputs(_inputs);
  };

  // function filterOnlyNumericValue(value) {
  //   return value.replace(/[^0-9]/g, '');
  // }

  const inputselect = (item, key) => {
    // setUnitKey(item.unit_name)

    const _inputselcet = [...inputs];

    _inputselcet[key].item_id = item._id;
    _inputselcet[key].unit_name = item.unit_name;
    _inputselcet[key].key = key;
    // setSteelItem(item.item_id);
    // console.log("_inputselcet");
    // console.log(item.unit_name);
    // setSelectKey(_inputselcet);

    setInputs(_inputselcet);
  };

  // console.log(selectData);

  const inputunit = (text, key) => {
    const _inputsunit = [...inputs];
    _inputsunit[key].unit_name = text;
    _inputsunit[key].key = key;
    setUnitKey(key);

    setInputs(_inputsunit);
  };
  const inputnos = (text, key) => {
    const _inputsunit = [...inputs];
    _inputsunit[key].nos = text;
    _inputsunit[key].key = key;
    // setUnitKey(key);

    setInputs(_inputsunit);
  };
  const inputlangth = (text, key) => {
    const _inputlangth = [...inputs];
    // _inputlangth[key].num_length = filterOnlyNumericValue([text]);
    _inputlangth[key].num_length = text;
    _inputlangth[key].key = key;

    setInputs(_inputlangth);
  };
  const inputMm = (text, key) => {
    const _inputlangth = [...inputs];
    // _inputlangth[key].num_length = filterOnlyNumericValue([text]);
    _inputlangth[key].steel_mm = text;
    _inputlangth[key].key = key;

    setInputs(_inputlangth);
  };
  const inputwidth = (text, key) => {
    const _inputwidth = [...inputs];
    _inputwidth[key].num_width = text;
    _inputwidth[key].key = key;
    setInputs(_inputwidth);
  };
  const inputhight = (text, key) => {
    const _inputhight = [...inputs];
    _inputhight[key].num_height = text;
    _inputhight[key].key = key;
    setInputs(_inputhight);
  };
  const inputtotal = (value, key) => {
    const _inputtotal = [...inputs];
    _inputtotal[key].num_total = value;
    _inputtotal[key].key = key;

    setInputs(_inputtotal);
  };

  const inputRemark = (text, key) => {
    const _inputRemark = [...inputs];
    _inputRemark[key].remark = text;
    _inputRemark[key].key = key;
    setInputs(_inputRemark);
  };
  //for sub dynamic inputs
  const Subinputlangth = (text, index1, key) => {
    const _subinputlangth = [...inputs];
    _subinputlangth[key].subquantityitems[index1].sub_length = text;
    _subinputlangth[key].subquantityitems[index1].key = key;
    // setSubInputs(_subinputlangth);
    setInputs(_subinputlangth);
  };
  const Subinputnos = (text, index1, key) => {
    const _subinputlangth = [...inputs];
    _subinputlangth[key].subquantityitems[index1].sub_nos = text;
    _subinputlangth[key].subquantityitems[index1].key = key;
    // setSubInputs(_subinputlangth);
    setInputs(_subinputlangth);
  };

  const SubinputMm = (text, index1, key) => {
    const _subinputlangth = [...inputs];
    _subinputlangth[key].subquantityitems[index1].sub_steel_mm = text;
    _subinputlangth[key].subquantityitems[index1].key = key;
    // setSubInputs(_subinputlangth);
    setInputs(_subinputlangth);
  };

  const Subinputwidth = (text, index1, key) => {
    const _subinputwidth = [...inputs];
    _subinputwidth[key].subquantityitems[index1].sub_width = text;
    _subinputwidth[key].subquantityitems[index1].key = key;
    setInputs(_subinputwidth);
  };
  const Subinputhight = (text, index1, key) => {
    const _subinputhight = [...inputs];
    _subinputhight[key].subquantityitems[index1].sub_height = text;
    _subinputhight[key].subquantityitems[index1].key = key;

    setInputs(_subinputhight);
  };
  const Subinputtotal = (value, index1, key) => {
    const _subinputtotal = [...inputs];
    _subinputtotal[key].subquantityitems[index1].sub_total = value;
    _subinputtotal[key].subquantityitems[index1].key = key;
    setInputs(_subinputtotal);
  };

  const SubinputRemark = (text, index1, key) => {
    const _subinputRemark = [...inputs];
    _subinputRemark[key].subquantityitems[index1].sub_remark = text;
    _subinputRemark[key].subquantityitems[index1].key = key;

    setInputs(_subinputRemark);
  };

  //close of sub dynamic inputs

  const fetchData = async () => {
    const resp = await fetch(`${process.env.API_URL}unit`);
    const data = await resp.json();
    setdata(data);
  };
  // get data api list

  useMemo(() => {
    fetchData();
  }, []);
  const saveItems = () => {
    const quantityworkitem = {
      item_name: quantityitem,
      unit_id: value,
      company_id: userData.company_id,
    };

    try {
      fetch(`${process.env.API_URL}quantity-report-item`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantityworkitem),
      })
        .then(response => response.json())
        .then(data => {
          setSaveItemsStatus(data);
          // reportdataitem();
          if (data.status == 200) {
            setvalue('');
            setquantityitem('');
            setSubmitToast(true);
            setTimeout(() => {
              setadditem(false);
              setSubmitToast(false);
            }, 500);
          } else {
            alert(data.message);
          }
          reportdataitem();
        });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const QualityTypeRadioButton = ({
    onPress,
    selected,
    children,
    type,
    mainKey,
  }) => {
    return (
      <View style={styles_m.radioButtonContainer}>
        <TouchableOpacity
          onPress={onPress}
          style={[
            inputs[mainKey].quality_type == type
              ? styles_m.radioButton
              : styles_m.radioButton2,
          ]}></TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles_m.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const SubQualityTypeRadioButton = ({
    onPress,
    selected,
    children,
    type,
    mainKey,
    subKey,
  }) => {
    return (
      <View style={styles_m.radioButtonContainer}>
        <TouchableOpacity
          onPress={onPress}
          style={[
            inputs[mainKey].subquantityitems[subKey].sub_quality_type == type
              ? styles_m.radioButton
              : styles_m.radioButton2,
          ]}></TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles_m.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const add_quantity_icon_button = () => {
    return (
      <TouchableOpacity
        style={{
          // backgroundColor: COLORS.white,
          borderRadius: SIZES.radius * 0.2,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 2,
        }}
        onPress={() => {
          setRemoveAddOnEdit(false);
          inputs.splice(0, inputs.length);
          setReportmodal(true);
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
            <Text style={[FONTS.body5, {color: COLORS.white}]}>Add</Text>
          </View>
          <View>
            <MaterialIcons name="add" size={15} color={COLORS.white} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const add_inside_handler = (key, e) => {
    let takekey = key;
    addKeyref.current = takekey;
    const _inputs = [...inputs];
    _inputs[key].subquantityitems.push({
      sub_nos: '',
      sub_length: '',
      sub_steel_mm: '',
      sub_width: '',
      sub_height: '',
      sub_total: '',
      sub_remark: '',
      sub_quality_type: '',
    });

    setInputs(_inputs);
  };

  const delete_inside_Handler = (key, index1) => {
    let _sub_inputs = [...inputs];
    // const _sub_inputs = subquantityitems.filter((input, index) => index != key);
    _sub_inputs[key].subquantityitems.splice(index1, 1);
    // setsubquantityitems(_sub_inputs);
    setInputs(_sub_inputs);
  };

  const add_subinput_field = (index1, key, subquantityitems, input) => {
    return (
      <View
        key={index1}
        style={{
          padding: 10,
          margin: 5,

          borderWidth: 1,
          borderColor: COLORS.lightblue_500,
          borderRadius: 2,
          elevation: 2,
          // padding: 10,
        }}>
        {/* <Text style={{ color: COLORS.black }}>{index1}</Text> */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          }}>
          {input.item_id === steelItem ? (
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={{
                  width: '28%',
                  borderWidth: 1,
                  height: 30,
                  padding: -6,
                  textAlign: 'center',
                  color: COLORS.black,
                  paddingLeft: 5,
                  marginBottom: 5,
                  borderRadius: 5,
                  marginLeft: 5,
                  borderColor: COLORS.gray,
                }}
                placeholder="MM"
                placeholderTextColor={COLORS.gray}
                value={subquantityitems.sub_steel_mm}
                keyboardType="numeric"
                onChangeText={text => {
                  // selectLengthkey(input.key)
                  // setLengthData(text)

                  setSubSteelMmkey(subquantityitems.key);
                  SubinputMm(text, index1, key);
                }}
              />
              <TextInput
                style={{
                  width: '40%',
                  borderWidth: 1,
                  height: 30,
                  padding: -6,
                  textAlign: 'center',
                  color: COLORS.black,
                  paddingLeft: 5,
                  marginBottom: 5,
                  borderRadius: 5,
                  marginLeft: 5,
                  borderColor: COLORS.gray,
                }}
                placeholder="Length"
                placeholderTextColor={COLORS.gray}
                value={subquantityitems.sub_length}
                keyboardType="numeric"
                onChangeText={text => {
                  setSubLengthkey(subquantityitems.key);
                  // setSubLengthData(text)
                  Subinputlangth(text, index1, key);
                }}
              />
            </View>
          ) : (
            <>
              <TextInput
                style={inputfromone}
                placeholder="L"
                placeholderTextColor={COLORS.lightGray1}
                value={subquantityitems.sub_length}
                keyboardType="numeric"
                onChangeText={text => {
                  // console.log(subquantityitems)
                  setSubLengthkey(subquantityitems.key);
                  // setSubLengthData(text)
                  Subinputlangth(text, index1, key);
                }}
              />
              <TextInput
                style={inputfromone}
                placeholder="B"
                placeholderTextColor={COLORS.lightGray1}
                value={subquantityitems.sub_width}
                keyboardType="numeric"
                onChangeText={text => {
                  setSubWidthkey(subquantityitems.key);
                  // setSubWidthData(text)
                  Subinputwidth(text, index1, key);
                }}
              />
              {input.item_id === paintingItem ||
              input.item_id === plasterItem ||
              input.item_id === floringItem ? (
                <View style={{flex: 1}}></View>
              ) : (
                <TextInput
                  style={inputfromone}
                  placeholder="T"
                  placeholderTextColor={COLORS.lightGray1}
                  value={subquantityitems.sub_height}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setSubHeightkey(subquantityitems.key);
                    // setSubThicknessData(text)
                    Subinputhight(text, index1, key);
                  }}
                />
              )}
            </>
          )}
          {input.item_id === steelItem ? (
            <TextInput
              style={inputfromtwo}
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={COLORS.white}
              placeholder={'Total'}
              value={
                ((index1 == subLengthKey) == subSteelMmKey) == subNosKey
                  ? (subquantityitems.sub_total = (
                      subquantityitems.sub_length *
                      (subquantityitems.sub_nos *
                        subquantityitems.sub_steel_mm *
                        subquantityitems.sub_steel_mm) *
                      0.00616
                    )
                      .toFixed(2)
                      .toString())
                  : (subquantityitems.sub_total = (
                      subquantityitems.sub_length *
                      (subquantityitems.sub_nos *
                        subquantityitems.sub_steel_mm *
                        subquantityitems.sub_steel_mm) *
                      0.00616
                    )
                      .toFixed(2)
                      .toString())
              }
              keyboardType="numeric"
              onChangeText={value => {
                Subinputtotal(value, index1, key);
              }}
            />
          ) : (
            <TextInput
              style={inputfromtwo}
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={COLORS.white}
              placeholder={'Total'}
              value={
                input.item_id === paintingItem ||
                input.item_id === plasterItem ||
                input.item_id === floringItem
                  ? ((key == subLengthKey) == subWidthKey) == subNosKey
                    ? (subquantityitems.sub_total = (
                        subquantityitems.sub_length *
                        subquantityitems.sub_width *
                        subquantityitems.sub_nos
                      ).toFixed(2)).toString()
                    : (subquantityitems.sub_total = (
                        subquantityitems.sub_length *
                        subquantityitems.sub_width *
                        subquantityitems.sub_nos
                      ).toFixed(2)).toString()
                  : ((index1 == subLengthKey) == subWidthKey) == subHeightKey
                  ? (subquantityitems.sub_total = (
                      subquantityitems.sub_length *
                      subquantityitems.sub_width *
                      subquantityitems.sub_height
                    ).toFixed(2)).toString()
                  : (subquantityitems.sub_total = (
                      subquantityitems.sub_length *
                      subquantityitems.sub_width *
                      subquantityitems.sub_height
                    ).toFixed(2)).toString()
              }
              keyboardType="numeric"
              onChangeText={value => {
                Subinputtotal(value, index1, key);

                // console.log(value)
              }}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          {/* <View > */}
          <TextInput
            style={{
              width: '70%',
              borderWidth: 1,
              height: 30,
              padding: -6,
              paddingLeft: 5,
              borderRadius: 5,
              marginLeft: 5,
              color: COLORS.black,
              borderColor: COLORS.gray,
              flexWrap: 'wrap',
            }}
            placeholder={'Remark'}
            placeholderTextColor={COLORS.lightGray1}
            value={subquantityitems.sub_remark}
            onChangeText={text => {
              SubinputRemark(text, index1, key);
              // setSubTotalData(subquantityitems.sub_total)
              // setSubRemarkData(text)
            }}
          />
          <TextInput
            style={inputfromone}
            // editable={false}
            selectTextOnFocus={false}
            placeholder={'Nos'}
            // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
            value={subquantityitems.sub_nos}
            onChangeText={text => {
              Subinputnos(text, index1, key);
              setSubNoskey(subquantityitems.key);
            }}
          />
          {/* </View> */}
        </View>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={[
              FONTS.h4,
              {
                color: COLORS.darkGray,
                textAlign: 'left',
                paddingHorizontal: 10,
              },
            ]}>
            Binding Quality
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {qualityType
            ? qualityType.map((subQualityRadioItem, subQualityIndex) => (
                <SubQualityTypeRadioButton
                  onPress={() =>
                    onSubQualityRadioBtnClick(subQualityRadioItem, key, index1)
                  }
                  selected={subQualityRadioItem.selected}
                  key={subQualityRadioItem._id}
                  type={subQualityRadioItem.type}
                  mainKey={key}
                  subKey={index1}>
                  <Text style={[FONTS.h4, {color: COLORS.black}]}>
                    {subQualityRadioItem.type}
                  </Text>
                </SubQualityTypeRadioButton>
              ))
            : null}
          <View>
            <TouchableOpacity
              style={{
                elevation: 8,
                borderColor: COLORS.transparent,
                alignSelf: 'flex-end',
              }}
              onPress={() => delete_inside_Handler(key, index1)}>
              <Image
                source={icons.delete_icon}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.green,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  //for main box quality
  const onRadioBtnClick = (radioitem, key) => {
    const _input = [...inputs];
    _input[key].quality_type = radioitem.type;
    _input[key].key = key;

    setInputs(_input);
    let updatedState = qualityType.map(isLikedItem =>
      isLikedItem._id === radioitem._id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setQualityType(updatedState);
  };

  //for sub box quality
  const onSubQualityRadioBtnClick = (subQualityRadioItem, key, index1) => {
    const _inputs = [...inputs];
    _inputs[key].subquantityitems[index1].sub_quality_type =
      subQualityRadioItem.type;
    _inputs[key].subquantityitems[index1].key = key;
    setInputs(_inputs);

    let updatedState = qualityType.map(isLikedItem =>
      isLikedItem._id === subQualityRadioItem._id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setQualityType(updatedState);
  };

  const add_input_and_subinput = () => {
    return (
      <View style={container}>
        <ScrollView style={inputsContainer}>
          {inputs
            ? inputs.map((input, key) => {
                return (
                  <View
                    style={[
                      inputContainer,
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
                        marginHorizontal: 5,
                        marginRight: -SIZES.base * 2.5,
                        // alignItems: 'center',
                      }}
                      // key={key}
                      key="{(key+1)}">
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
                        // data={reportdata.data}
                        data={itemData}
                        search
                        maxHeight={300}
                        labelField="item_name"
                        valueField="_id"
                        placeholder={!isFocus ? 'Select' : '...'}
                        searchPlaceholder="Search..."
                        value={input.item_id}
                        onFocus={() => {
                          reportdataitem();
                          checkQuantityItemExist();
                        }}
                        onChange={item => {
                          setSelectKey(input.key);
                          getLatestSteelId();
                          getPaintingId();
                          getFloorId();
                          getPlasterId();
                          setCompanyIdData(item.company_id);
                          inputselect(item, key);
                        }}
                      />
                      <TextInput
                        style={inputfromtwo}
                        editable={false}
                        selectTextOnFocus={false}
                        placeholder={'unit'}
                        // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
                        value={
                          key == selectKey ? input.unit_name : input.unit_name
                        }
                        onChangeText={text => {
                          inputunit(text, key);
                        }}
                      />

                      <TouchableOpacity
                        key={key}
                        onPress={e => {
                          add_inside_handler(key, e);
                        }}>
                        <MaterialIcons
                          name="add-box"
                          size={25}
                          color={COLORS.darkBlue}
                          style={{alignItems: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                    {input.item_id === steelItem ? (
                      <View style={{flexDirection: 'row'}}>
                        <TextInput
                          style={{
                            width: '28%',
                            borderWidth: 1,
                            height: 30,
                            padding: -6,
                            textAlign: 'center',
                            color: COLORS.black,
                            paddingLeft: 5,
                            marginBottom: 5,
                            borderRadius: 5,
                            marginLeft: 5,
                            borderColor: COLORS.gray,
                          }}
                          placeholder="MM"
                          placeholderTextColor={COLORS.gray}
                          value={input.steel_mm}
                          keyboardType="numeric"
                          onChangeText={text => {
                            // selectLengthkey(input.key)
                            setSteelMMkey(input.key);
                            // setLengthData(text)
                            // console.log(text)
                            inputMm(text, key);
                          }}
                        />
                        <TextInput
                          style={{
                            width: '40%',
                            borderWidth: 1,
                            height: 30,
                            padding: -6,
                            textAlign: 'center',
                            color: COLORS.black,
                            paddingLeft: 5,
                            marginBottom: 5,
                            borderRadius: 5,
                            marginLeft: 5,
                            borderColor: COLORS.gray,
                          }}
                          placeholder="Length"
                          placeholderTextColor={COLORS.gray}
                          value={input.num_length}
                          keyboardType="numeric"
                          onChangeText={text => {
                            selectLengthkey(input.key);
                            // setLengthData(text)
                            // console.log(text)
                            inputlangth(text, key);
                          }}
                        />
                        <TextInput
                          style={inputfromtwo}
                          editable={false}
                          selectTextOnFocus={false}
                          placeholderTextColor={COLORS.white}
                          placeholder={'Total'}
                          value={
                            ((key == lengthKey) == steelMMKey) == nosKey
                              ? (input.num_total = (
                                  input.num_length *
                                  (input.nos *
                                    input.steel_mm *
                                    input.steel_mm) *
                                  0.00616
                                )
                                  .toFixed(2)
                                  .toString())
                              : (input.num_total = (
                                  input.num_length *
                                  (input.nos *
                                    input.steel_mm *
                                    input.steel_mm) *
                                  0.00616
                                )
                                  .toFixed(2)
                                  .toString())
                          }
                          keyboardType="numeric"
                          onChangeText={value => {
                            inputtotal(value, key);
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TextInput
                          style={inputfromone}
                          placeholder="Length"
                          placeholderTextColor={COLORS.gray}
                          value={input.num_length}
                          keyboardType="numeric"
                          onChangeText={text => {
                            selectLengthkey(input.key);
                            // setLengthData(text)
                            // console.log(text)
                            inputlangth(text, key);
                          }}
                        />
                        <TextInput
                          style={inputfromone}
                          placeholder="Breadth"
                          placeholderTextColor={COLORS.gray}
                          value={input.num_width}
                          keyboardType="numeric"
                          onChangeText={text => {
                            selectWidthkey(input.key);
                            // setWidthData(text)
                            inputwidth(text, key);
                          }}
                        />
                        {input.item_id === paintingItem ||
                        input.item_id === plasterItem ||
                        input.item_id === floringItem ? (
                          <View style={{flex: 1}}></View>
                        ) : (
                          <TextInput
                            style={inputfromone}
                            placeholder="Thickness"
                            placeholderTextColor={COLORS.gray}
                            value={input.num_height}
                            keyboardType="numeric"
                            onChangeText={text => {
                              selectHeightkey(input.key);
                              // setThicknessData(text)
                              // setTotalData()

                              inputhight(text, key);
                            }}
                          />
                        )}
                        <TextInput
                          style={inputfromtwo}
                          editable={false}
                          selectTextOnFocus={false}
                          placeholderTextColor={COLORS.white}
                          placeholder={'Total'}
                          value={
                            input.item_id === paintingItem ||
                            input.item_id === plasterItem ||
                            input.item_id === floringItem
                              ? ((key == lengthKey) == widthKey) == nosKey
                                ? (input.num_total = (
                                    input.num_length *
                                    input.num_width *
                                    input.nos
                                  ).toFixed(2)).toString()
                                : (input.num_total = (
                                    input.num_length *
                                    input.num_width *
                                    input.nos
                                  ).toFixed(2)).toString()
                              : ((key == lengthKey) == widthKey) == heightKey
                              ? (input.num_total = (
                                  input.num_length *
                                  input.num_width *
                                  input.num_height
                                ).toFixed(2)).toString()
                              : (input.num_total = (
                                  input.num_length *
                                  input.num_width *
                                  input.num_height
                                ).toFixed(2)).toString()
                          }
                          keyboardType="numeric"
                          onChangeText={value => {
                            inputtotal(value, key);
                          }}
                        />
                      </View>
                    )}
                    <TextInput
                      // multiline={5}
                      style={{
                        width: '70%',
                        borderWidth: 1,
                        height: 30,
                        padding: -6,
                        paddingLeft: 5,
                        marginBottom: 5,
                        borderRadius: 5,
                        marginLeft: 5,
                        color: COLORS.gray,
                        borderColor: COLORS.gray,
                        flexWrap: 'wrap',
                      }}
                      placeholder={'Remark'}
                      placeholderTextColor={COLORS.gray}
                      value={input.remark}
                      onChangeText={text => {
                        // setTotalData(input.num_total)
                        // setRemarkData(text);
                        inputRemark(text, key);
                      }}
                    />
                    <TextInput
                      style={inputfromone}
                      // editable={false}
                      placeholderTextColor={COLORS.gray}
                      selectTextOnFocus={false}
                      placeholder={'Nos'}
                      keyboardType="numeric"
                      // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
                      value={input.nos}
                      onChangeText={text => {
                        setNoskey(input.key);
                        inputnos(text, key);
                      }}
                    />
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        marginRight: SIZES.width * 0.5,
                      }}>
                      <Text style={{color: COLORS.darkGray, ...FONTS.h4}}>
                        Binding Quality:
                      </Text>
                    </View>

                    {qualityType
                      ? qualityType.map(radioitem => (
                          <QualityTypeRadioButton
                            onPress={() => onRadioBtnClick(radioitem, key)}
                            selected={radioitem.selected}
                            key={radioitem._id}
                            type={radioitem.type}
                            mainKey={key}>
                            <Text style={[FONTS.h4, {color: COLORS.black}]}>
                              {radioitem.type}
                            </Text>
                          </QualityTypeRadioButton>
                        ))
                      : null}

                    <View>
                      {inputs[key].subquantityitems.map(
                        (subquantityitems, index1) => {
                          return add_subinput_field(
                            index1,
                            key,
                            subquantityitems,
                            input,
                          );
                        },
                      )}
                      <View style={{alignSelf: 'flex-end'}}>
                        <TouchableOpacity
                          style={{
                            elevation: 8,
                            borderColor: COLORS.transparent,
                            alignSelf: 'flex-end',
                          }}
                          onPress={() => deleteHandler(key)}>
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
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    );
  };

  const add_qty_data_modal = () => {
    return (
      <View>
        <Modal visible={reportmodal} transparent={false} animationType="slide">
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View
              style={{
                // flex: 1,
                backgroundColor: '#fff',
                marginTop: 90,
                height: '90%',
                width: '100%',
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
                <Title>Quantity Exec. Today</Title>
                <Pressable
                  onPress={() => {
                    inputs.splice(0, inputs.length);
                    setReportmodal(false);
                    setRemoveAddOnEdit(false);
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
                {removeAddOnEdit ? null : (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 1,
                      paddingHorizontal: 2,
                      elevation: 1,
                      borderColor: COLORS.transparent,
                      margin: 5,
                    }}
                    onPress={() => {
                      addHandler();
                      // selectunitdata();
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 1,
                      }}>
                      <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                        Add On Existing Item
                      </Text>
                      <MaterialIcons
                        name="add-box"
                        size={20}
                        color={COLORS.green}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    paddingHorizontal: 4,
                    margin: 5,
                    borderRadius: 1,
                    elevation: 1,
                    borderColor: COLORS.transparent,
                  }}
                  onPress={() => {
                    setadditem(true);
                  }}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Add New ITEM
                  </Text>
                </TouchableOpacity>
              </View>
              {/*  */}
              {add_input_and_subinput()}
              {/*  */}
              {/* <Toast config={showToast} /> */}
              {removeAddOnEdit ? (
                <TextButton
                  label="Update"
                  buttonContainerStyle={{
                    height: 55,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightblue_700,
                  }}
                  onPress={() => {
                    updateQuantityData();
                  }}
                />
              ) : (
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
                    setRemoveAddOnEdit(false);
                    insertQtyPostData();
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const add_item_modal = () => {
    return (
      <View>
        <Modal transparent={false} visible={additem} animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
              // justifyContent: 'center',
            }}>
            <View
              style={{
                // flex: 1,
                backgroundColor: '#fff',
                marginTop: 80,
                padding: 20,
                borderRadius: SIZES.base,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // borderBottomWidth: 1,
                }}>
                <Text style={{...FONTS.h2, color: COLORS.darkGray}}>
                  Quantity item
                </Text>
                <Pressable onPress={setadditem}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View style={{marginTop: 20}}>
                <FormInput
                  label="Name"
                  onChange={quantityitem => {
                    setquantityitem(quantityitem);
                  }}
                />
                <Dropdown
                  style={[dropdown1, isFocus && {borderColor: 'blue'}]}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="unit_name"
                  valueField="_id"
                  placeholder={!isFocus ? 'Select' : '...'}
                  placeholderStyle={{
                    fontSize: 16,
                    color: COLORS.darkGray,
                    left: 5,
                  }}
                  selectedTextStyle={{color: COLORS.gray}}
                  inputSearchStyle={{
                    color: COLORS.gray,
                    height: 40,
                    borderRadius: 5,
                    padding: -5,
                  }}
                  value={value}
                  searchPlaceholder="Search..."
                  onFocus={() => {
                    setIsFocus(true);
                    fetchData();
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setvalue(item._id);
                    // setunitname(item.unit_name);
                    setIsFocus(false);
                  }}
                />
              </View>
              <View>
                <TextButton
                  label="Save Item"
                  buttonContainerStyle={{
                    height: 45,
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.padding,
                  }}
                  onPress={() => {
                    saveItems();
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

  const Edit_delete_button = ({edit_size, del_size, __id}) => {
    return (
      <>
        <View style={body_ed_de_view}>
          <View style={body_del_btn}>
            <TouchableOpacity onPress={() => editReportBtn(__id)}>
              {/* <Foundation name='page-edit' color={item.id == selectedEditId ? "#2aaeff" : null} size={24} /> */}
              <FontAwesome name="edit" color={COLORS.blue} size={edit_size} />
            </TouchableOpacity>
          </View>
          <View style={body_edit_btn}>
            <TouchableOpacity
              onPress={() => {
                setDeleteQtyId(__id);
                setDeleteConfirm(true);
              }}>
              <MaterialCommunityIcons
                name="delete"
                color={COLORS.red}
                size={del_size}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <View>
      <Animated.View style={{transform: [{scale}]}}>
        <Pressable
          onPress={() => {
            Main_drp_pro_value ? null : alert('Select Project First!');
            setQuantity(!quant_ity);
            LayoutAnimation.easeInEaseOut();
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            paddingVertical: 3,
            overflow: 'hidden',
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
                setQuantity(!quant_ity);
                LayoutAnimation.easeInEaseOut();
              }}
              style={[FONTS.h3, {color: COLORS.white2}]}>
              Quantity Exec. Today
            </Text>
          </View>
          <View style={{alignItems: 'flex-end', alignSelf: 'center'}}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setQuantity(!quant_ity);
                LayoutAnimation.easeInEaseOut();

                Main_drp_pro_value ? null : alert('Select Project First!');
              }}>
              <AntDesign name="caretdown" size={12} color={COLORS.white2} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          right: SIZES.base * 2,
        }}>
        {/* button section adding contractor */}
        {quant_ity ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View style={{backgroundColor: 'blue', paddingLeft: 140}}>
              {add_quantity_icon_button()}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'skyblue',
                width: SIZES.width * 0.92,
                alignSelf: 'flex-start',
                position: 'relative',
                top: 20,
                marginLeft: 17,
                // height: 200,
                maxHeight: 200,
                paddingBottom: 6,
                // flex:2,
                // marginBottom: -20,
                // padding: 5,
                elevation: 1,
              }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  maxHeight: 500,
                  borderWidth: 2,
                }}>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      top: 5,
                      left: -12,
                      position: 'relative',
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 5,
                        marginRight: 2,
                        marginLeft: 16,
                        // borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 45,
                        //  borderColor: COLORS.lightblue_200
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        S.no
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 5,
                        marginRight: 2,
                        // marginLeft: 8,
                        // borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 45,
                        //  borderColor: COLORS.lightblue_200
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Nos.
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        //  borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 145,
                        //  borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Item Name
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        justifyContent: 'center',
                        width: 50,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Length
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        // borderLeftWidth: 2,
                        paddingLeft: 4,
                        justifyContent: 'center',
                        width: 55,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Breadth
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 15,
                        // borderLeftWidth: 2,
                        paddingLeft: 4,
                        justifyContent: 'center',
                        width: 70,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Th/ht/mm
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        //  borderLeftWidth: 2,
                        justifyContent: 'center',
                        width: 60,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Total
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 15,
                        //  borderLeftWidth: 2,
                        // borderRightWidth: 2,
                        justifyContent: 'center',
                        //  width: 50, borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Unit
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        justifyContent: 'center',
                        paddingLeft: 25,
                        width: SIZES.width * 0.5,
                        // borderColor: COLORS.lightblue_200,
                        // borderWidth:1
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Remark
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        justifyContent: 'center',
                        width: 120,
                        // borderColor: COLORS.lightblue_200,
                        // borderWidth:1
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Quality
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 0,
                        paddingLeft: 15,
                        // borderLeftWidth: 2,
                        //  borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 60,
                        //  borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Action
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      // height: 230,
                      top: 10,
                      paddingBottom: 15,
                      // borderWidth: 3,
                      // borderColor: COLORS.lightblue_200,
                    }}>
                    <>
                      {getRepPostData.data.length > 0 ? (
                        getRepPostData.data.map((list, index) => (
                          <View
                            style={{
                              flexDirection: 'column',
                              alignContent: 'space-between',
                              paddingVertical: 20,
                              top: -20,
                            }}
                            key={index}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                top: 10,
                                paddingVertical: 3,
                                left: -26,
                              }}>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 45,
                                  position: 'absolute',

                                  left: 29,
                                  // right: 10,
                                  //  left:0,
                                  top: 3,
                                  //  bottom:0
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {
                                        color: COLORS.darkGray,
                                        textAlign: 'center',
                                      },
                                    ]}>
                                    {index + 1}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 42,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 145,
                                  position: 'absolute',
                                  left: 20,
                                  top: 3,
                                  //  bottom:0
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {
                                        color: COLORS.darkGray,
                                        textAlign: 'center',
                                      },
                                    ]}>
                                    {list.quantityWorkItems.nos}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 100,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 145,
                                  position: 'absolute',
                                  left: 150,
                                  top: 3,

                                  // right: 10,
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {color: COLORS.darkGray},
                                    ]}>
                                    {list.quantityWorkItems.item_name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 145,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 50,
                                  position: 'absolute',
                                  left: 280,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.num_length}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 55,
                                  position: 'absolute',
                                  left: 340,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.num_width}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 70,
                                  position: 'absolute',
                                  left: 420,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.item_id == steelItem
                                    ? list.quantityWorkItems.steel_mm
                                    : list.quantityWorkItems.num_height}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 60,
                                  position: 'absolute',
                                  left: 490,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.num_total
                                    .toFixed(2)
                                    .replace(/\.0+$/, '')}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 50,
                                  position: 'absolute',
                                  left: 550,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,

                                  // right: 10,
                                }}>
                                <View>
                                  <View
                                    style={{
                                      position: 'absolute',
                                      width: 1,
                                      left: 50,
                                      top: -10,
                                    }}>
                                    <Divider
                                      style={{
                                        backgroundColor: COLORS.lightGray1,
                                        height: SIZES.height,
                                        top: 5,
                                      }}
                                    />
                                  </View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {
                                        color: COLORS.darkGray,
                                        textAlign: 'center',
                                      },
                                    ]}>
                                    {list.quantityWorkItems.unit_name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: -4,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: SIZES.width * 0.5,
                                  position: 'absolute',
                                  left: 575,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.remark}
                                </Text>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 210,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: SIZES.width * 0.5,
                                  position: 'absolute',
                                  left: 750,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.quantityWorkItems.quality_type}
                                </Text>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 165,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  // alignContent: "center",
                                  // alignSelf: "center",
                                  width: 60,
                                  position: 'absolute',
                                  left: 920,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Edit_delete_button
                                    edit_size={18}
                                    del_size={22}
                                    __id={list.quantityWorkItems._id}
                                  />
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                top: 10,
                                position: 'relative',
                                left: 170,
                              }}>
                              {getRepPostData
                                ? list.quantityWorkItems.subquantityitems.map(
                                    (res, index2) => (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          // borderRightWidth: 2,
                                          // borderWidth: 1,

                                          // borderColor: COLORS.lightblue_200,
                                          alignContent: 'center',
                                          position: 'relative',
                                          paddingBottom: 12,
                                          top: 35,
                                          marginBottom: 0,
                                        }}
                                        key={index2}>
                                        <View
                                          style={{
                                            width: 50,
                                            position: 'absolute',
                                            top: 10,
                                            left: -SIZES.width * 0.3,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_nos}
                                          </Text>
                                          {/* <View style={{ position: "absolute", width: 1, left: 60, top: -59 }}>
                                        <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                      </View> */}
                                        </View>
                                        <View
                                          style={{
                                            width: 50,
                                            position: 'absolute',
                                            top: 10,
                                            left: 85,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_length}
                                          </Text>
                                          <View
                                            style={{
                                              position: 'absolute',
                                              width: 1,
                                              left: 60,
                                              top: -59,
                                            }}>
                                            <Divider
                                              style={{
                                                backgroundColor:
                                                  COLORS.lightGray1,
                                                height: SIZES.height,
                                                top: 5,
                                              }}
                                            />
                                          </View>
                                        </View>
                                        <View
                                          style={{
                                            width: 50,
                                            position: 'absolute',
                                            top: 10,
                                            left: 145,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_width}
                                          </Text>
                                          <View
                                            style={{
                                              position: 'absolute',
                                              width: 1,
                                              left: 62,
                                              top: -59,
                                            }}>
                                            <Divider
                                              style={{
                                                backgroundColor:
                                                  COLORS.lightGray1,
                                                height: SIZES.height,
                                                top: 5,
                                              }}
                                            />
                                          </View>
                                        </View>
                                        <View
                                          style={{
                                            width: 70,
                                            position: 'absolute',
                                            top: 10,
                                            left: 225,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {list.quantityWorkItems.item_id ==
                                            steelItem
                                              ? res.sub_steel_mm
                                              : res.sub_height}
                                          </Text>
                                          <View
                                            style={{
                                              position: 'absolute',
                                              width: 1,
                                              left: 80,
                                              top: -59,
                                            }}>
                                            <Divider
                                              style={{
                                                backgroundColor:
                                                  COLORS.lightGray1,
                                                height: SIZES.height,
                                                top: 5,
                                              }}
                                            />
                                          </View>
                                        </View>
                                        <View
                                          style={{
                                            width: 60,
                                            position: 'absolute',
                                            top: 10,
                                            left: 295,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_total
                                              .toFixed(2)
                                              .replace(/\.0+$/, '')}
                                          </Text>
                                        </View>

                                        <View
                                          style={{
                                            width: SIZES.width * 0.5,
                                            // position: "absolute",
                                            // backgroundColor:"red",
                                            top: 10,
                                            left: 380,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_remark}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: 60,
                                            // position: "absolute",
                                            // backgroundColor:"red",
                                            top: 10,
                                            left: 425,
                                            // borderWidth: 1,
                                            // borderColor: COLORS.lightblue_200,
                                          }}>
                                          {/* <View style={{ justifyContent: "center", alignSelf: "center" }}>
                                        <Edit_delete_button edit_size={18} del_size={22} __id={l.item_id} />
                                      </View> */}
                                          <Text
                                            style={[
                                              FONTS.h4,
                                              {
                                                color: COLORS.darkGray,
                                                textAlign: 'center',
                                              },
                                            ]}>
                                            {res.sub_quality_type}
                                          </Text>
                                        </View>
                                      </View>
                                    ),
                                  )
                                : null}
                            </View>
                            <View style={{position: 'absolute', top: 23}}>
                              <Divider
                                style={{
                                  backgroundColor: COLORS.lightGray1,
                                  width: SIZES.width * 3,
                                  marginHorizontal: 2,
                                  top: 5,
                                }}
                              />
                            </View>
                          </View>
                        ))
                      ) : (
                        <View>
                          <Text
                            style={[
                              FONTS.h4,
                              {
                                color: COLORS.gray,
                                textAlign: 'auto',
                                marginHorizontal: SIZES.body1 * 4.7,
                              },
                            ]}>
                            Currently, no report to show!
                          </Text>
                        </View>
                      )}
                    </>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : null}
        {/* <View style={{ top: 22, left: -40, borderWidth: 1, borderColor: COLORS.lightblue_300, paddingHorizontal: 60 }}><Text>Nothing to display!!</Text></View> */}
      </View>
      {add_qty_data_modal()}
      {add_item_modal()}

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
      <DeleteConfirmationToast
        isVisible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteReportButton()}
      />
    </View>
  );
};

export default Quantity;
const styles_m = StyleSheet.create({
  databeBox: {
    margin: 0,
    textAlign: 'center',
    overflow: 'visible',
    // flexDirection: "row",
    justifyContent: 'space-evenly',
  },
  databeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    margin: 5,
    paddingHorizontal: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButton2: {
    height: 18,
    width: 18,
    backgroundColor: '#E9E9E9',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    height: 18,
    width: 18,
    backgroundColor: 'green',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: 'green',
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
