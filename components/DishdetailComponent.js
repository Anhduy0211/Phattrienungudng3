// redux
import { connect } from 'react-redux';
import { postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
};
const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId))
});

import React, { Component } from 'react';
import { View, ScrollView, Modal, Text, FlatList,useState, YellowBox,StyleSheet,TouchableHighlight,TextInput,PanResponder,Alert} from 'react-native';
import { Card, Image, Icon,Rating } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
class RenderDish extends Component {
  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  render() {
      // gesture
      const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200) return true; // right to left
        return false;
      };
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => { return true; },
        onPanResponderEnd: (e, gestureState) => {
          if (recognizeDrag(gestureState)) {
            Alert.alert(
              'Add Favorite',
              'Are you sure you wish to add ' + dish.name + ' to favorite?',
              [
                { text: 'Cancel', onPress: () => { /* nothing */ } },
                { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
              ],
              { cancelable: false }
            );
          }
          return true;
        }
      });
      //render
    const dish = this.props.dish;
    const { modalVisible } = this.state;
    if (dish != null) {
      return (
        <Card {...panResponder.panHandlers}>
          <View style={{minWidth:'100%'}}>
          <Modal style={{  justifyContent: 'center',
                           margin: 20,
                          }} animationType={'slide'} animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{color:'orange'}}>Rating:5/5</Text>
               <Rating
                  startingValue={5}
                  ratingColor="#f1c644"
                    ratingBackgroundColor="#d4d4d4"
                  imageSize={25}
                  readonly // by default is false
                  icon="ios-star"
                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                />
                <View style={{  
                              flexDirection: 'row',
                              backgroundColor: '#fff',}}>
                  <Icon style={{padding: 10,}} name="user" type="font-awesome"/>
                  <TextInput style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1,width:200 }}  placeholder="Author" />
                </View>
                <View style={{   
                                  flexDirection: 'row',
                                  backgroundColor: '#fff',}}>
                  <Icon style={{padding: 10,}} name="comment" type="font-awesome"/>
                   <TextInput style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1,width:200 }}  placeholder="Comment" /> 
                </View>
                  
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#2196F3",width:150 }}
                     onPress={() => {
                     this.setModalVisible(!modalVisible);
                   }}
                     >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "gray", margin: 10,width:150}}
                     onPress={() => {
                     this.setModalVisible(!modalVisible);
                   }}
                     >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
          </View>

          <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'}
            type='font-awesome' color='#f50' onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPress()}/>
          <Icon raised reverse name={this.props.favorite ?'pencil': 'pencil'} type='font-awesome' color='#512da7' onPress={() => this.setModalVisible(true)}/>
          </View>
        </Card>

        
      );
    }
    return (<View />);
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <FlatList data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={item => item.id.toString()} />
      </Card>
    );
  }

  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <View >
        <Rating
        startingValue={item.rating}
        ratingColor="#f1c644"
        ratingBackgroundColor="#d4d4d4"
        imageSize={15}
         readonly // by default is false
        icon="ios-star"
          direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
      />
        </View>
      
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']); // ref: https://forums.expo.io/t/warning-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-the-same-orientation-use-another-virtualizedlist-backed-container-instead/31361/6
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    return (
      <ScrollView>
        <Animatable.View animation="fadeInDown"duration={2000} delay={1000}>
        <RenderDish
          dish={this.props.dishes.dishes[dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp"duration={2000} delay={1000}>
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </Animatable.View>
       
        
      </ScrollView>
    );
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);