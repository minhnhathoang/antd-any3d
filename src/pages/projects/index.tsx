import {useRequest} from '@umijs/max';
import {Card, Col, Form, List, Row, Select, Typography} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, {FC, useRef, useState} from 'react';
// import { categoryOptions } from '../../mock';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
// import TagSelect from './components/TagSelect';
import type {ListItemDataType} from './data.d';
import {queryFakeList} from './service';
import useStyles from './style.style';
import {Environment, OrbitControls, PerspectiveCamera, Preload, View} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {Apple, Duck} from "@/components/ModelCard/models";
import TagSelect from './components/TagSelect';
;

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const {Paragraph} = Typography;
const getKey = (id: string, index: number) => `${id}-${index}`;
const Projects: FC = () => {
    const {styles} = useStyles();
    const {data, loading, run} = useRequest((values: any) => {
      console.log('form data', values);
      return queryFakeList({
        count: 8,
      });
    });
    const list = data?.list || [
      {
        "id": "fake-list-0",
        "owner": "付小小",
        "title": "Alipay",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png",
        "status": "active",
        "percent": 71,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        "href": "https://ant.design",
        "updatedAt": 1711120767742,
        "createdAt": 1711120767742,
        "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 101222,
        "newUser": 1053,
        "star": 192,
        "like": 124,
        "message": 13,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-1",
        "owner": "曲丽丽",
        "title": "Angular",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png",
        "status": "exception",
        "percent": 96,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png",
        "href": "https://ant.design",
        "updatedAt": 1711113567742,
        "createdAt": 1711113567742,
        "subDescription": "希望是一个好东西，也许是最好的，好东西是不会消亡的",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 131421,
        "newUser": 1023,
        "star": 136,
        "like": 174,
        "message": 11,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-2",
        "owner": "林东东",
        "title": "Ant Design",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png",
        "status": "normal",
        "percent": 83,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png",
        "href": "https://ant.design",
        "updatedAt": 1711106367742,
        "createdAt": 1711106367742,
        "subDescription": "生命就像一盒巧克力，结果往往出人意料",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 171972,
        "newUser": 1438,
        "star": 134,
        "like": 171,
        "message": 16,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-3",
        "owner": "周星星",
        "title": "Ant Design Pro",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png",
        "status": "active",
        "percent": 72,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
        "href": "https://ant.design",
        "updatedAt": 1711099167742,
        "createdAt": 1711099167742,
        "subDescription": "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 199385,
        "newUser": 1312,
        "star": 105,
        "like": 190,
        "message": 13,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-4",
        "owner": "吴加好",
        "title": "Bootstrap",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png",
        "status": "exception",
        "percent": 51,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
        "href": "https://ant.design",
        "updatedAt": 1711091967742,
        "createdAt": 1711091967742,
        "subDescription": "那时候我只会想自己想要什么，从不想自己拥有什么",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 167524,
        "newUser": 1438,
        "star": 135,
        "like": 128,
        "message": 11,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-5",
        "owner": "朱偏右",
        "title": "React",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png",
        "status": "normal",
        "percent": 90,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png",
        "href": "https://ant.design",
        "updatedAt": 1711084767742,
        "createdAt": 1711084767742,
        "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 139885,
        "newUser": 1636,
        "star": 143,
        "like": 145,
        "message": 18,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-6",
        "owner": "鱼酱",
        "title": "Vue",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png",
        "status": "active",
        "percent": 78,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png",
        "href": "https://ant.design",
        "updatedAt": 1711077567742,
        "createdAt": 1711077567742,
        "subDescription": "希望是一个好东西，也许是最好的，好东西是不会消亡的",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 146123,
        "newUser": 1683,
        "star": 180,
        "like": 139,
        "message": 11,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      },
      {
        "id": "fake-list-7",
        "owner": "乐哥",
        "title": "Webpack",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png",
        "cover": "https://m.media-amazon.com/images/M/MV5BNDg5OGQ0MDgtZGM0ZS00NzgzLTllOGQtNjQ0YzU2M2RkMjQyXkEyXkFqcGdeQXVyMTA0MjU0Ng@@._V1_.jpg",
        "status": "exception",
        "percent": 50,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png",
        "href": "https://ant.design",
        "updatedAt": 1711070367742,
        "createdAt": 1711070367742,
        "subDescription": "生命就像一盒巧克力，结果往往出人意料",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 153996,
        "newUser": 1303,
        "star": 150,
        "like": 136,
        "message": 19,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽",
            "id": "member1"
          },
          {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君",
            "id": "member2"
          },
          {
            "avatar": "https://picsum.photos/200/300?grayscale",
            "name": "董娜娜",
            "id": "member3"
          }
        ]
      }
    ];
    const cardList = list && (
        <List<ListItemDataType>
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <Card className={styles.card} hoverable
                    cover={
                      <View className="view scale" style={{ height: 300 }}>
                        <Common color="lightgray" />
                        <Duck position={[0, -1, 0]} scale={14} />
                        <OrbitControls makeDefault />
                      </View>
                    }
              >
                <Card.Meta
                  title={<a>{item.title}</a>}
                  description={
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                      }}
                    >
                      {item.subDescription}
                    </Paragraph>
                  }
                />
                <div className={styles.cardItemContent}>
                  <span>{dayjs(item.updatedAt).fromNow()}</span>
                  <div className={styles.avatarList}>
                    <AvatarList size="small">
                      {item.members.map((member, i) => (
                        <AvatarList.Item
                          key={getKey(item.id, i)}
                          src={member.avatar}
                          tips={member.name}
                        />
                      ))}
                    </AvatarList>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )
    ;
    const formItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };
    return (
      <div className={styles.coverCardList}>
        <Card bordered={false}>
          <Form
            layout="inline"
            onValuesChange={(_, values) => {
              // 表单项变化时请求数据
              // 模拟查询表单生效
              run(values);
            }}
          >
            <StandardFormRow
              title="所属类目"
              block
              style={{
                paddingBottom: 11,
              }}
            >
              <FormItem name="category">
                {/*<TagSelect expandable>*/}
                {/*  {categoryOptions.map((category) => (*/}
                {/*    <TagSelect.Option value={category.value!} key={category.value}>*/}
                {/*      {category.label}*/}
                {/*    </TagSelect.Option>*/}
                {/*  ))}*/}
                {/*</TagSelect>*/}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="作者" name="author">
                    <Select
                      placeholder="不限"
                      style={{
                        maxWidth: 200,
                        width: '100%',
                      }}
                      options={[
                        {
                          label: '王昭君',
                          value: 'lisa',
                        },
                      ]}
                    />
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="好评度" name="rate">
                    <Select
                      placeholder="不限"
                      style={{
                        maxWidth: 200,
                        width: '100%',
                      }}
                      options={[
                        {
                          label: '优秀',
                          value: 'good',
                        },
                        {
                          label: '普通',
                          value: 'normal',
                        },
                      ]}
                    />
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
      </div>
  )
    ;
  }
;

function Common({ color }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="dawn" />
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
    </>
  )
}

function Link({ href, text, children }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  return (
    <a
      href={href}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerMove={(e) => {
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY - e.target.offsetTop - 100
        ref.current.style.transform = `translate3d(${x}px,${y}px,0)`
      }}>
      {text}
      <View
        ref={ref}
        visible={hovered}
        index={Infinity} // Render this view on top of all others
        className="view"
        style={{ position: 'absolute', width: 200, display: 'block', pointerEvents: 'none' }}>
        <group>{children}</group>
      </View>
    </a>
  )
}

export default Projects;
