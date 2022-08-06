import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  LogBox,
  Image,
  ImageBackground,
} from 'react-native';
import {
  HeaderBar,
  TextButton,
  IconButton,
  FormInput,
  CustomDropdown,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {useSelector} from 'react-redux';
import {
  deleteProjectCategory,
  getProjectCategory,
  getProjectType,
  postProjectCategory,
  updateProjectCategory,
  postProjectType,
  updateProjectType,
  deleteProjectType,
} from '../../../controller/ProjectCategoryAndTypeController';

const CategoryandType = () => {
  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  });

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  // delete confirmation
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteConfirm1, setDeleteConfirm1] = React.useState(false);

  // COMPANY DATA
  const companyData = useSelector(state => state.company);

  // STATES FOR STORING CATEGORIES & PROJECT TYPES DATA
  const [projectCategories, setProjectCategories] = React.useState([]);
  const [projectTypes, setProjectTypes] = React.useState([]);
  //Modal
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [showTypesModal, setShowTypesModal] = React.useState(false);
  // Form Data
  const [catName, setCatName] = React.useState('');
  const [typeName, setTypeName] = React.useState('');
  //Dropdown
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  // get project category
  const projectCategory = async () => {
    let response = await getProjectCategory();
    let catFromApi = response.data.map(item => {
      return {label: item.category_name, value: item._id};
    });
    setProjectCategories(response.data);
    setItems(catFromApi);
  };

  const postCategory = async () => {
    const formData = {
      category_name: catName,
      company_id: companyData._id,
    };
    let response = await postProjectCategory(formData);
    if (response.status == 200) {
      setShowCategoryModal(false);
      setSubmitToast(true);
      setCatName('');
      projectCategory();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const [id, setId] = React.useState('');
  const getId = id => {
    console.log(id);
    setId(id);
  };

  // get cat data
  const getData = name => {
    setCatName(name);
  };

  const editCategory = async () => {
    const formData = {
      category_name: catName,
      company_id: companyData._id,
    };
    let response = await updateProjectCategory(id, formData);

    if (response.status == 200) {
      setUpdateToast(true);
      projectCategory();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  const getCategoryId = id => {
    setCategoryId(id);
    setDeleteConfirm(true);
  };
  const [category_id, setCategoryId] = React.useState('');

  const deletecategory = async () => {
    let response = await deleteProjectCategory(category_id);
    if (response.status == 200) {
      setDeleteConfirm(false);
      setDeleteToast(true);
      projectCategory();
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 1500);
  };

  // get project types
  const getprojectTypes = async () => {
    let response = await getProjectType();
    setProjectTypes(response.data);
  };

  const postTypes = async () => {
    const formData = {
      category_id: value,
      project_type: typeName,
      company_id: companyData._id,
    };
    let response = await postProjectType(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      setTypeName('');
      getprojectTypes();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const [typeid, setTypeId] = React.useState('');
  const gettypeId = id => {
    setTypeId(id);
  };

  const getTypeData = (cat_id, name) => {
    setValue(cat_id);
    setTypeName(name);
  };

  const edittype = async () => {
    const formData = {
      category_id: value,
      project_type: typeName,
      company_id: companyData._id,
    };
    let response = await updateProjectType(typeid, formData);
    if (response.status === 200) {
      setUpdateToast(true);
      getprojectTypes();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  const getTypeId = id => {
    setTypId(id);
    setDeleteConfirm1(true);
  };
  const [type_id, setTypId] = React.useState('');

  const deleteType = async () => {
    let response = await deleteProjectType(type_id);
    if (response.status === 200) {
      setDeleteConfirm1(false);
      setDeleteToast(true);
      getprojectTypes();
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 1500);
  };

  React.useEffect(() => {
    projectCategory();
    getprojectTypes();
  }, []);

  function renderCategories() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            paddingVertical: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
              {index + 1}.
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                marginLeft: SIZES.radius,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.category_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                getId(item._id);
                getData(item.category_name);
                setShowCategoryModal(true);
                // OnEdit();
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  padding: 3,
                  borderRadius: 2,
                  right: 15,
                }}>
                <Image
                  source={icons.edit}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: COLORS.white,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getCategoryId(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  padding: 3,
                  borderRadius: 2,
                }}>
                <Image
                  source={icons.delete_icon}
                  style={{height: 12, width: 12, tintColor: COLORS.white}}
                />
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.padding,
          padding: 20,
          borderRadius: 3,
          backgroundColor: COLORS.lightblue_50,
          ...styles.shadow,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Categories</Text>
          <TextButton
            label="Add New"
            buttonContainerStyle={{
              paddingHorizontal: 5,
              borderRadius: 2,
            }}
            labelStyle={{...FONTS.h5}}
            onPress={() => {
              setCatName(''), setShowCategoryModal(true);
            }}
          />
        </View>
        <FlatList
          contentContainerStyle={{marginTop: SIZES.radius, paddingBottom: 15}}
          data={projectCategories}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          maxHeight={350}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: COLORS.gray2,
                  // marginVertical: 5,
                }}></View>
            );
          }}
        />
      </View>
    );
  }

  function renderTypes() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            paddingVertical: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
              {index + 1}.
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                marginLeft: SIZES.radius,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.project_type}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                gettypeId(item._id);
                getTypeData(item.category_id, item.project_type);
                setShowTypesModal(true);
                // OnEditTypes();
                // edittype();
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  padding: 3,
                  borderRadius: 2,
                  right: 15,
                }}>
                <Image
                  source={icons.edit}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: COLORS.white,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getTypeId(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  padding: 3,
                  borderRadius: 2,
                }}>
                <Image
                  source={icons.delete_icon}
                  style={{height: 12, width: 12, tintColor: COLORS.white}}
                />
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          marginVertical: SIZES.padding * 1.5,
          marginHorizontal: SIZES.padding,
          padding: 20,
          borderRadius: 3,
          backgroundColor: COLORS.lightblue_50,
          ...styles.shadow,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Types</Text>
          <TextButton
            label="Add New"
            buttonContainerStyle={{
              paddingHorizontal: 5,
              borderRadius: 2,
            }}
            labelStyle={{...FONTS.h5}}
            onPress={() => {
              projectCategory();
              setTypeName('');
              setShowTypesModal(true);
            }}
          />
        </View>
        <FlatList
          contentContainerStyle={{marginTop: SIZES.radius, paddingBottom: 15}}
          data={projectTypes}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          maxHeight={350}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: COLORS.gray2,
                }}></View>
            );
          }}
        />
      </View>
    );
  }

  function renderAddCategoriesModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}>
        <TouchableWithoutFeedback>
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
                left: SIZES.padding,
                width: '90%',
                padding: SIZES.padding,
                borderRadius: 5,
                backgroundColor: COLORS.white,
              }}>
              <View style={{}}>
                {/* header */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{flex: 1, fontSize: 20, color: COLORS.darkGray}}>
                    Project Categories
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
                    onPress={() => setShowCategoryModal(false)}
                  />
                </View>
                <ScrollView
                  style={{
                    marginTop: SIZES.radius,
                  }}>
                  <FormInput
                    label="Name"
                    keyboardType="default"
                    autoCompleteType="username"
                    value={catName}
                    onChange={value => {
                      setCatName(value);
                    }}
                  />
                  <TextButton
                    label="Submit"
                    buttonContainerStyle={{
                      height: 50,
                      alignItems: 'center',
                      marginTop: SIZES.padding,
                      borderRadius: SIZES.radius,
                    }}
                    onPress={() => {
                      id === ''
                        ? (postCategory(), setShowCategoryModal(false))
                        : (editCategory(), setShowCategoryModal(false));
                    }}
                  />
                </ScrollView>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderAddTypesModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={showTypesModal}>
        <TouchableWithoutFeedback>
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
                left: SIZES.padding,
                width: '90%',
                padding: SIZES.padding,
                borderRadius: 5,
                backgroundColor: COLORS.white,
              }}>
              <View style={{}}>
                {/* header */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{flex: 1, fontSize: 20, color: COLORS.darkGray}}>
                    Project Types
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
                    onPress={() => setShowTypesModal(false)}
                  />
                </View>
                <ScrollView
                  style={{
                    marginTop: SIZES.base,
                  }}>
                  <CustomDropdown
                    placeholder="Select Categories"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    categorySelectable={true}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    maxHeight={170}
                  />
                  <FormInput
                    label="Name"
                    keyboardType="default"
                    autoCompleteType="username"
                    value={typeName}
                    onChange={value => {
                      setTypeName(value);
                    }}
                  />
                  <TextButton
                    label="Submit"
                    buttonContainerStyle={{
                      height: 50,
                      alignItems: 'center',
                      marginTop: SIZES.padding * 2,
                      borderRadius: SIZES.radius,
                    }}
                    onPress={() => {
                      typeid === ''
                        ? (postTypes(), setShowTypesModal(false))
                        : (edittype(), setShowTypesModal(false));
                    }}
                  />
                </ScrollView>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderBar right={true} title="Categories & Types" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderCategories()}
        {renderTypes()}
        {renderAddCategoriesModal()}
        {renderAddTypesModal()}
      </ScrollView>

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
        onClickYes={() => {
          deletecategory();
        }}
      />
      <DeleteConfirmationToast
        isVisible={deleteConfirm1}
        onClose={() => setDeleteConfirm1(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteType()}
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
});

export default CategoryandType;
