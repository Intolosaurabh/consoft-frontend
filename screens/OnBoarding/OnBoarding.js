import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {FONTS, COLORS, SIZES, icons, images, constants} from '../../constants';
import {TextButton, FormInput} from '../../Components';
import LinearGradient from 'react-native-linear-gradient';

const OnBoarding = ({navigation}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onViewChangeRef = React.useRef(({viewableItems, changed}) => {
    setCurrentIndex(viewableItems[0].index);
  });

  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {constants.onboarding_screens.map((item, index) => {
          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [
              COLORS.lightOrange,
              COLORS.primary,
              COLORS.lightOrange,
            ],
            extrapolate: 'clamp',
          });
          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`dot-${index}`}
              style={{
                borderRadius: 5,
                marginHorizontal: 6,
                width: dotWidth,
                height: 10,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };

  function renderHeaderLogo() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.height > 800 ? 50 : 25,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.consoft_PNG}
          resizeMode="contain"
          style={{
            width: SIZES.width * 0.5,
            height: 100,
          }}
        />
      </View>
    );
  }

  function renderFooter() {
    return (
      <View
        style={{
          height: 160,
        }}>
        {/* Pagination  */}

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Dots />
        </View>
        {/* buttons  */}
        {currentIndex < constants.onboarding_screens.length - 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding,
              marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="Skip"
              buttonContainerStyle={{backgroundColor: null}}
              labelStyle={{
                color: COLORS.darkGray2,
              }}
              onPress={() => navigation.replace('SignIn')}
            />
            <TextButton
              label="Next"
              buttonContainerStyle={{
                height: 45,
                width: 120,
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                flatListRef?.current?.scrollToIndex({
                  index: currentIndex + 1,
                  animated: true,
                });
              }}
            />
          </View>
        )}
        {currentIndex == constants.onboarding_screens.length - 1 && (
          <View
            style={{
              paddingHorizontal: SIZES.padding,
              marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="Let's Get Started"
              buttonContainerStyle={{
                height: 45,
                borderRadius: SIZES.radius,
              }}
              onPress={() => navigation.replace('SignIn')}
            />
          </View>
        )}
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          flex: 1.5,
        }}>
        <ImageBackground
          source={images.backg_05}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            width: '100%',
          }}>
          <Image
            source={images.build_f}
            resizeMode="contain"
            style={{
              width: SIZES.width * 0.7,
              height: SIZES.width * 0.7,
              marginBottom: -SIZES.padding,
            }}
          />
        </ImageBackground>
      </View>
      <View style={{flex: 2, marginTop: SIZES.radius}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <TextButton
              label="User Login"
              buttonContainerStyle={{
                paddingVertical: SIZES.base,
                paddingHorizontal: SIZES.radius,
                backgroundColor: COLORS.lightblue_600,
              }}
              onPress={() => navigation.replace('SignIn')}
            />
          </View>
          <View style={{marginLeft: SIZES.padding}}>
            <TextButton
              label="Company Login"
              buttonContainerStyle={{
                paddingHorizontal: SIZES.radius,
                paddingVertical: SIZES.base,
                backgroundColor: COLORS.lightblue_600,
              }}
              onPress={() => navigation.replace('SignIn')}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: SIZES.padding * 2,
            marginHorizontal: SIZES.padding,
            ...styles.container,
          }}>
          <FormInput
            placeholder="Mobile"
            keyboardType="default"
            autoCompleteType="username"
            onChange={value => {
              setProjectTeamName(value);
            }}
          />
          <FormInput
            placeholder="Password"
            keyboardType="default"
            autoCompleteType="username"
            onChange={value => {
              setProjectTeamName(value);
            }}
          />
          <TextButton
            label="Submit"
            buttonContainerStyle={{
              height: 45,
              alignItems: 'center',
              marginTop: SIZES.padding * 2,
              borderRadius: SIZES.radius,
            }}
            onPress={() => alert('Okay...')}
          />
        </View>
      </View>
      {renderHeaderLogo()}
      {/* {renderFooter()} */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
});
export default OnBoarding;
