import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  Platform,
  SafeAreaView,
} from "react-native";

import { usePrevious } from "./helpers/StateHelpers";
import { isNullOrWhitespace } from "./helpers/ValidationHelpers";
import GestureRecognizer from "react-native-swipe-gestures";
import IconButton from "./components/IconButton";

const { width, height } = Dimensions.get("window");

export const StoryListItem = (props) => {
  const stories = props.stories;

  const [load, setLoad] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [content, setContent] = useState(
    stories.map((x) => {
      return {
        id: x.id,
        productId: x.productId,
        image: x.story_image,
        onBottomPress: x.onBottomPress,
        swipeText: x.swipeText,
        finish: 0,
      };
    })
  );

  const [current, setCurrent] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;

  const prevCurrentPage = usePrevious(props.currentPage);

  const isLiked = props.likedList.includes(content[current].id);

  useEffect(() => {
    let isPrevious = prevCurrentPage > props.currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          x.finish = 0;
        }
      } else {
        x.finish = 0;
      }
    });
    setContent(data);
    start();
  }, [props.currentPage]);

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (
        current > prevCurrent &&
        content[current - 1].image == content[current].image
      ) {
        start();
      } else if (
        current < prevCurrent &&
        content[current + 1].image == content[current].image
      ) {
        start();
      }
    }
  }, [current]);

  function start() {
    setLoad(false);
    progress.setValue(0);
    startAnimation();
  }

  function startAnimation() {
    Animated.timing(progress, {
      toValue: 1,
      duration: props.duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        next();
      }
    });
  }

  function onSwipeUp() {
    if (props.onClosePress) {
      props.onClosePress();
    }
    if (content[current].onPress) {
      content[current].onPress();
    }
  }

  function onSwipeDown() {
    props?.onClosePress();
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function next() {
    // check if the next content is not empty
    setLoad(true);
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      // the next content is empty
      close("next");
    }
  }

  function previous() {
    // checking if the previous content is not empty
    setLoad(true);
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
    } else {
      // the previous content is empty
      close("previous");
    }
  }

  function close(state) {
    let data = [...content];
    data.map((x) => (x.finish = 0));
    setContent(data);
    progress.setValue(0);
    if (props.currentPage == props.index) {
      if (props.onFinish) {
        props.onFinish(state);
      }
    }
  }

  const swipeText =
    content?.[current]?.swipeText || props.swipeText || "Swipe Up";

  return (
    <GestureRecognizer
      onSwipeUp={(state) => onSwipeUp(state)}
      onSwipeDown={(state) => onSwipeDown(state)}
      config={config}
      style={{
        flex: 1,
        backgroundColor: "black",
      }}>
      <SafeAreaView>
        <View style={{ position: "absolute", right: 30, top: 250, zIndex: 40 }}>
          <IconButton
            containerStyle={styles.sideButton}
            onPress={() => props.onLikePress(content[current].id)}
            iconName={isLiked ? "heart-multiple" : "heart-multiple-outline"}
            iconStyle={styles.textShadow}
            iconSize={props.iconSize}
            color={isLiked ? "#DA5874" : "#fff"}
          />
          <IconButton
            containerStyle={styles.sideButton}
            onPress={() => props.onCartPress(content[current].id)}
            iconName="cart-plus"
            iconStyle={styles.textShadow}
            iconSize={props.iconSize}
            color="#fff"
          />
          <IconButton
            containerStyle={styles.sideButton}
            onPress={() =>
              props.onSharePress(
                content[current].id,
                content[current].productId
              )
            }
            iconName="share-variant"
            iconStyle={styles.textShadow}
            iconSize={props.iconSize}
            color="#fff"
          />
        </View>
        <View style={styles.backgroundContainer}>
          <Image
            onLoadEnd={() => start()}
            source={{ uri: content[current].image }}
            style={styles.image}
          />
          {load && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={"white"} />
            </View>
          )}
        </View>
      </SafeAreaView>
      {/* Progress bar */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={styles.animationBarContainer}>
          {content.map((index, key) => {
            return (
              <View key={key} style={styles.animationBackground}>
                <Animated.View
                  style={{
                    flex: current == key ? progress : content[key].finish,
                    height: 2,
                    backgroundColor: "white",
                  }}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.userContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.avatarImage}
              source={{ uri: props.profileImage }}
            />
            <Text style={styles.avatarText}>{props.profileName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (props.onClosePress) {
                props.onClosePress();
              }
            }}>
            <View style={styles.closeIconContainer}>
              {props.customCloseComponent ? (
                props.customCloseComponent
              ) : (
                <Text style={{ color: "white", fontSize: 20 }}>X</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.pressContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                previous();
              }
            }}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                next();
              }
            }}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      {content[current].onBottomPress && (
        <>
          {props.customSwipeUpComponent ? (
            props.customSwipeUpComponent
          ) : (
            <IconButton
              iconName="chevron-up"
              onPress={content[current].onBottomPress}
              containerStyle={styles.swipeUpBtn}
              iconSize={props.iconSize}
              color="#fff"
              iconStyle={styles.textShadow}
              textStyle={[
                { color: "white", fontSize: 20, marginTop: 5 },
                styles.textShadow,
              ]}
              title={swipeText}
            />
          )}
        </>
      )}
    </GestureRecognizer>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};

const styles = StyleSheet.create({
  textShadow: {
    shadowOpacity: 2,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  sideButton: {
    marginVertical: 10,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  spinnerContainer: {
    zIndex: -100,
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "black",
    alignSelf: "center",
    width: width,
    height: height,
  },
  animationBarContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  animationBackground: {
    height: 2,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(117, 117, 117, 0.5)",
    marginHorizontal: 2,
  },
  userContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  avatarImage: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    paddingLeft: 10,
  },
  closeIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 15,
  },
  pressContainer: {
    flex: 1,
    flexDirection: "row",
  },
  swipeUpBtn: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    bottom: Platform.OS == "ios" ? 20 : 50,
  },
});
