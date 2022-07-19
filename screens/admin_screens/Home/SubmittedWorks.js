import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import Config from '../../../config';
import {FormInput, ProgressBar} from '../../../Components';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';

const SubmittedWorks = () => {
  //COMPANY DATA

  
    
    const companyData = useSelector(state => state.company);
    const company_id = companyData._id;
    // console.log(companyData);


  const [submitWork, setSubmitWork] = React.useState([]);
  const [verifyResponse, setVerifyResponse] = React.useState([]);
  const [revertModal, setRevertModal] = React.useState(false);
  const [revertMsg, setRevertMsg] = React.useState('');
  const [revertId, setRevertId] = React.useState('');

  // GET SUBMITTED WORKS
  // React.useEffect(() => {
  //   fetch(`${Config.API_URL}submit-works/` + `${company_id}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setSubmitWork(data);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [submitWork]);

  // verify works
  const verifyHandler = id => {
    fetch(`${Config.API_URL}verify-submit-work` + `/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setVerifyResponse(data.status);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getRevertWorkId = id => {
    setRevertId(id);
  };

  const OnSubmit = () => {
    const formData = {revert_msg: revertMsg};
    fetch(`${Config.API_URL}revert-submit-work` + `/${revertId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  function renderRevertModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={revertModal}>
        <TouchableWithoutFeedback onPress={() => setRevertModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                width: '80%',
                top: '30%',
                borderRadius: SIZES.base,
              }}>
              <FormInput
                placeholder="Write here..."
                multiline={true}
                numberOfLines={5}
                onChange={value => {
                  setRevertMsg(value);
                }}
              />
              {/* <View
                style={{
                  marginTop: SIZES.base,
                  paddingHorizontal: SIZES.base,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.gray,
                }}>
                <TextInput
                  placeholder="Write your message here.."
                  
                  multiline={true}
                  numberOfLines={3}
                  onChange={value => {
                    setRevertMsg(value);
                  }}
                />
              </View> */}
              <TouchableOpacity
                style={{
                  marginTop: SIZES.radius,
                  alignItems: 'flex-end',
                }}
                onPress={() => OnSubmit()}>
                <Text
                  style={{
                    ...FONTS.h3,
                    backgroundColor: COLORS.lightblue_600,
                    paddingHorizontal: SIZES.base,
                    paddingVertical: 3,
                    borderRadius: 2,
                    color: COLORS.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderSubmitWork() {
    const renderItem = ({item}) => {
      return (
        <View style={{}}>
          {/* username  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...FONTS.h4,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                fontWeight: 'bold',
              }}>
              {item.user_name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', right: 10}}>
                <Image
                  source={icons.date}
                  style={{
                    height: 10,
                    width: 10,
                    tintColor: COLORS.darkGray,
                    right: 3,
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    color: COLORS.darkGray,
                  }}>
                  {item.submit_work_date}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.time}
                  style={{
                    height: 10,
                    width: 10,
                    tintColor: COLORS.darkGray,
                    right: 3,
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    color: COLORS.darkGray,
                  }}>
                  {item.submit_work_time}
                </Text>
              </View>
            </View>
          </View>
          {/* work  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                ...FONTS.h4,
                color: COLORS.black,
              }}>
              Work
              <Text style={{color: COLORS.darkGray}}> - {item.work}</Text>
            </Text>
            <TouchableOpacity onPress={verifyHandler(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  paddingHorizontal: 3,
                  borderRadius: 2,
                }}>
                <Text style={{fontSize: 10, color: COLORS.white}}>
                  {verifyResponse === 200 ? 'Verified' : 'Verify'}
                </Text>
                {/* <Image
                  source={verifyResponse == 200 ? icons.verify : icons.cancel}
                  resizeMode="contain"
                  style={{
                    height: 10,
                    width: 10,
                    tintColor: COLORS.lightblue_900,
                  }}
                /> */}
              </ImageBackground>
            </TouchableOpacity>
          </View>
          {/* message  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                ...FONTS.h4,
                color: COLORS.black,
              }}>
              Msg
              <Text style={{color: COLORS.darkGray}}>
                {' '}
                - {item.submit_work_text}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                getRevertWorkId(item._id), setRevertModal(true);
              }}
              style={{alignItems: 'flex-end'}}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  paddingHorizontal: 3,
                  borderRadius: 2,
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                  }}>
                  Revert
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                flex: 1,
                ...FONTS.h5,
                color: COLORS.black,
              }}>
              Submit Date & Time :
              <Text style={{color: COLORS.darkGray}}>
                {' '}
                {item.submit_work_date}
                {'  '} {item.submit_work_time}
              </Text>
            </Text>
          </View> */}
          {/* <View style={{marginTop: SIZES.base}}>
            <ProgressBar progress={item.persentage} />
          </View> */}
        </View>
      );
    };

    return (
      <FlatList
        contentContainerStyle={{}}
        data={submitWork}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: COLORS.gray2,
                marginVertical: SIZES.radius,
              }}></View>
          );
        }}
      />
    );
  }
  return (
    <View
      style={{
        ...styles.shadow,
        backgroundColor: COLORS.lightblue_50,
        marginHorizontal: SIZES.padding,
        marginTop: SIZES.padding,
        borderRadius: SIZES.radius,
        padding: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.darkGray,
          }}>
          Submitted Works
        </Text>
        {/* <TouchableOpacity onPress={() => console.log('fdjhg')}>
          <Image
            source={icons.filter}
            resizeMode="contain"
            style={{height: 18, width: 18, tintColor: COLORS.darkGray}}
          />
        </TouchableOpacity> */}
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: COLORS.gray2,
          marginVertical: SIZES.base,
        }}></View>
      {renderSubmitWork()}
      {renderRevertModal()}
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
export default SubmittedWorks;
