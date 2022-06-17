import React from 'react';
import {View, Image, TouchableOpacity, Text, Button} from 'react-native';
import {HeaderBar} from '../../Components';
import {COLORS, images, SIZES, icons} from '../../constants';
import AuthLayout from '../Authentication/AuthLayout';
import utils from '../../utils';
import {FormInput, TextButton, Toast} from '../../Components';

const VerifyProductKey = ({navigation}) => {
  const [productKey, setProductKey] = React.useState('');
  const [productKeyError, setProductKeyError] = React.useState('');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <HeaderBar right={true} title="Verify Product Key" />
      <AuthLayout
        title="Verify Your Product Key"
        subtitle="Product key has been sent to your email"
        image={images.product_key}>
        <View
          style={{
            marginTop: SIZES.padding * 2,
            marginHorizontal: SIZES.padding,
          }}>
          <FormInput
            // label="Email"
            placeholder="Product key"
            keyboardType="email-address"
            autoCompleteType="email"
            onChange={value => {
              utils.validateText(value, setProductKeyError);
              setProductKey(value);
            }}
            errorMsg={productKeyError}
            appendComponent={
              <View style={{justifyContent: 'center'}}>
                <Image
                  source={
                    productKey == '' ||
                    (productKey != '' && productKeyError == '')
                      ? icons.correct
                      : icons.cancel
                  }
                  style={{
                    height: 20,
                    width: 20,
                    tintColor:
                      productKey == ''
                        ? COLORS.gray
                        : productKey != '' && productKeyError == ''
                        ? COLORS.green
                        : COLORS.red,
                  }}
                />
              </View>
            }
          />
          <TextButton
            label="Submit & Continue"
            buttonContainerStyle={{
              height: 45,
              alignItems: 'center',
              marginTop: SIZES.padding,
              borderRadius: SIZES.base,
            }}
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </AuthLayout>
    </View>
  );
};

export default VerifyProductKey;