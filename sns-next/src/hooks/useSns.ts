import type { JsonUserType } from 'types/JsonUserType'
import { PostType } from 'types/PostType'
import type { EventType } from 'types/EventType'
import { postData, putData, deleteData } from 'apis/sns'
import { useRouter } from 'next/router'
import { ulid } from 'ulid'
import { auth } from 'auth/firebase'
import { signOut } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useAuth } from 'hooks/useAuth'
import { usePost } from 'hooks/usePost'
import { useState } from 'react'
import { action } from '@storybook/addon-actions'

export const useSns = () => {
  // ============================================
  // 共通部分
  // ============================================
  // Context
  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePost()
  const { firebaseUser, jsonUsers, setJsonUsers, isLogin, setIsLogin } =
    useAuth()

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'
  const usersUrl = 'http://localhost:3001/users'

  // routerオブジェクト作成
  const router = useRouter()

  // ============================================
  // ユーザー関係
  // ============================================
  // - ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // - formの初期表示を格納する変数を定義
  const nameDefaultValue: string | number = targetJsonUser?.name
  const profileDefaultValue: string | number = targetJsonUser?.profile

  // - ユーザーの情報追加の関数を定義
  const addInfo = (e: EventType['onSubmit']) => {
    e.preventDefault()

    // 名前フォームの値を取得
    const nameInput = e.currentTarget.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement
    const nameValue = nameInput.value

    // プロフィールフォームの値を取得
    const profileInput = e.currentTarget.querySelector(
      'input[name="profile"]'
    ) as HTMLInputElement
    const profileValue = profileInput.value

    if (jsonUsers && firebaseUser) {
      // そのデータのname,profileプロパティを上書き
      targetJsonUser.name = nameValue
      targetJsonUser.profile = profileValue

      // Update（Users）
      putData(usersUrl, targetJsonUser.id, targetJsonUser)
    }

    // /にリダイレクト
    router.push('/')
  }

  // - ユーザーの情報修正の関数を定義
  const editInfo = (e: EventType['onSubmit']) => {
    e.preventDefault()

    // 名前フォームの値を取得
    const nameInput = e.currentTarget.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement
    const nameValue = nameInput.value

    // プロフィールフォームの値を取得
    const profileInput = e.currentTarget.querySelector(
      'input[name="profile"]'
    ) as HTMLInputElement
    const profileValue = profileInput.value

    if (jsonUsers && firebaseUser) {
      // そのデータのname,profileプロパティを上書き
      targetJsonUser.name = nameValue
      targetJsonUser.profile = profileValue

      // Update（Users）
      putData(usersUrl, targetJsonUser.id, targetJsonUser)
    }

    // /にリダイレクト
    router.push('/')
  }

  // - ユーザーをフォローする、外す関数を定義
  const toggleFollow = (targetUserId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.followUserId.indexOf(targetUserId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.followUserId.filter((userId) => {
        return userId !== targetUserId
      })
      targetJsonUser.followUserId = [...newData]
    } else {
      // 含んでいない場合は追加
      targetJsonUser.followUserId.push(targetUserId)
    }

    // Update（Users）
    putData(usersUrl, targetJsonUser.id, targetJsonUser)

    // State更新
    // jsonUsers
    // 変更対象（ログインしているユーザー）以外のデータを抽出
    const newUsers = jsonUsers?.filter((user) => {
      return user.id !== targetJsonUser.id
    }) as JsonUserType[]

    setJsonUsers([...newUsers, targetJsonUser])

    // showPosts
    // 自分の投稿を抽出
    const MyPosts = allPosts?.filter((post) => {
      return post.userId === firebaseUser?.uid
    }) as PostType[]

    // フォローしているユーザーの投稿を抽出
    // json-serverにおける、ログインしているユーザーデータのfollowUserIdプロパティ（配列）にidが含まれているユーザーの投稿を表示
    // = followUserId（配列）中に、post.idが入っていれば表示
    const followsPosts = allPosts?.filter((post) => {
      return targetJsonUser.followUserId.indexOf(post.userId) !== -1
    }) as PostType[]

    setShowPosts([...MyPosts, ...followsPosts])
  }

  // ============================================
  // 投稿関数
  // ============================================
  // - 投稿追加の関数を定義
  const addPost = (e: EventType['onSubmit']) => {
    e.preventDefault()

    // 投稿フォームの値を取得
    const postInput = e.currentTarget.querySelector(
      'textarea'
    ) as HTMLTextAreaElement
    const postValue = postInput.value

    // jsonに追加するデータを作成
    const newPost = {
      id: ulid(),
      content: postValue,
      addFavoriteUserId: [],
      userId: targetJsonUser.id,
      userName: targetJsonUser.name,
      replyId: '',
    }

    // Create（Posts）
    // thenを使うことで、投稿の追加が完了した後に実行する処理を指定する
    postData(postsUrl, newPost)
      .then(() => {
        // State更新
        allPosts && setAllPosts([...allPosts, newPost])
        showPosts && setShowPosts([...showPosts, newPost])
      })
      .then(() => {
        // /にリダイレクト
        router.push('/')
      })
  }

  // - 投稿削除の関数を定義
  const deletePost = (deletePostId: string) => {
    // Delete（Posts）
    // thenを使うことで、投稿の削除が完了した後に実行する処理を指定する
    deleteData(postsUrl, deletePostId).then(() => {
      // State更新
      // allPostsからidプロパティの値がdeletePostIdではないデータのみ抽出
      const newAllPosts = allPosts?.filter((post) => {
        return post.id !== deletePostId
      })
      newAllPosts && setAllPosts([...newAllPosts])

      // showPostsからidプロパティの値がdeletePostIdではないデータのみ抽出
      const newShowPosts = showPosts?.filter((post) => {
        return post.id !== deletePostId
      })
      newShowPosts && setShowPosts([...newShowPosts])
    })
  }

  // - 投稿をお気に入りに追加する関数を定義
  const toggleFavorite = (targetPostId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.favoritePostId.indexOf(targetPostId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.favoritePostId.filter((postId) => {
        return postId !== targetPostId
      })
      targetJsonUser.favoritePostId = [...newData]
    } else {
      // 含んでいない場合は追加）
      targetJsonUser.favoritePostId.push(targetPostId)
    }

    // Update（Users）
    putData(usersUrl, targetJsonUser.id, targetJsonUser)

    // State更新
    // 変更対象（ログインしているユーザー）以外のデータを抽出
    const newUsers = jsonUsers?.filter((user) => {
      return user.id !== targetJsonUser.id
    }) as JsonUserType[]

    setJsonUsers([...newUsers, targetJsonUser])
  }

  // ============================================
  // ログイン関係
  // ============================================
  // - ログイン
  const signIn = async (e: EventType['onSubmit']) => {
    e.preventDefault()

    // メールフォームの値を取得
    const emailInput = e.currentTarget.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement
    const emailValue = emailInput.value

    // パスワードフォームの値を取得
    const passwordInput = e.currentTarget.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement
    const passwordValue = passwordInput.value

    // firebaseで用意されている、ログインの関数
    await signInWithEmailAndPassword(auth, emailValue, passwordValue)

    // /にリダイレクト
    router.push('/')
  }

  // - 新規登録
  const signUp = async (e: EventType['onSubmit']) => {
    e.preventDefault()

    // メールフォームの値を取得
    const emailInput = e.currentTarget.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement
    const emailValue = emailInput.value

    // パスワードフォームの値を取得
    const passwordInput = e.currentTarget.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement
    const passwordValue = passwordInput.value

    // firebaseで用意されている、ユーザー登録の関数
    // thenを使うことで、firebase側のユーザー登録が完了した後に実行する処理を指定する
    await createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((user) => {
        // firebase側に登録したユーザー情報をjson-serverにも追加
        // 追加するデータを作成
        // ※ json-server側のデータのidとfirebase側のユーザーのuilを紐付ける
        // ※ name,profileはこの後設定するため空文字、favoritePostId,followUserId,follwedUserIdは空の配列にしておく
        const newJsonUser = {
          id: user.user.uid,
          name: '',
          profile: '',
          favoritePostId: [],
          followUserId: [],
          follwedUserId: [],
        }

        // Create（Users）
        postData(usersUrl, newJsonUser)

        // State更新
        jsonUsers && setJsonUsers([...jsonUsers, newJsonUser])
      })
      .then(() => {
        // /add/userにリダイレクト
        router.push('/add/user')
      })
      .catch((Error) => {
        console.log(Error)
      })
  }

  // ログアウトの関数を定義
  const logout = async () => {
    // firebaseで用意されている、ログアウトの関数
    await signOut(auth)

    // /signinにリダイレクト
    await router.push('/signin')
  }

  // ユーザー削除の関数を定義
  const deleteUser = async () => {
    // firebase側のユーザー削除
    // thenを使うことで、firebase側のユーザー削除が完了した後に実行する処理を指定する
    firebaseUser
      ?.delete()
      .then(() => {
        // json-server側のユーザー削除
        // 削除するユーザーのidを取得
        const deleteTargetUserId = targetJsonUser.id
        // Delete（Users）
        deleteData(usersUrl, deleteTargetUserId)

        // State更新
        // idプロパティの値がdeleteTargetUserIdではないデータのみ抽出
        const newUsers = jsonUsers?.filter((jsonUser) => {
          return jsonUser.id !== deleteTargetUserId
        })
        newUsers && setJsonUsers([...newUsers])
      })
      .then(() => {
        // /signinにリダイレクト
        router.push('/signin')
      })
      .catch((Error) => {
        console.log(Error)
      })
  }

  // ============================================
  // ユーザーページ
  // ============================================
  // タブを切り替える関数を定義
  const changeTab = (e: EventType['onClick']) => {
    // クリックされたボタンのidと、現在aria-selected属性がtrueになっているボタンのidを取得
    const targetButton = e.currentTarget
    const targetButtonId = targetButton.getAttribute('id')
    const activeButton = document.querySelector('[aria-selected = "true"]')
    const activeButtonId = activeButton?.getAttribute('id')

    // 2つのidが異なる時のみ、ボタンのaria-selected属性、タブのaria-hidden属性の切り替え処理を行う
    if (targetButtonId !== activeButtonId) {
      // ボタン
      // 現在aria-selected属性がtrueになっているものをfalseに変える
      activeButton?.setAttribute('aria-selected', 'false')

      // クリックされたボタンのaria-selected属性の値をtrueにする
      targetButton.setAttribute('aria-selected', 'true')

      // タブ
      // 現在aria-hidden属性がfalseになっているタブを取得し、trueに変える
      const activeTab = document.querySelector('[aria-hidden = "false"]')
      activeTab?.setAttribute('aria-hidden', 'true')

      // クリックされたボタンのid属性から対応するタブのコンテンツを取得し、aria-hidden属性をfalseにする
      const tabName = targetButtonId?.slice(4)
      const tabContentId = `content-${tabName}`
      const tabContent = document.getElementById(tabContentId)
      tabContent?.setAttribute('aria-hidden', 'false')
    }
  }

  // ============================================
  // コンポーネント
  // ============================================
  // HamburgerButton
  // State
  // 開閉を管理
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Function
  // stateの値を反転する
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    action('toggleMenu')(!isOpen)
  }

  return {
    allPosts,
    setAllPosts,
    showPosts,
    setShowPosts,
    firebaseUser,
    jsonUsers,
    setJsonUsers,
    router,
    targetJsonUser,
    addInfo,
    editInfo,
    toggleFollow,
    nameDefaultValue,
    profileDefaultValue,
    addPost,
    deletePost,
    toggleFavorite,
    signIn,
    signUp,
    logout,
    deleteUser,
    changeTab,
    isOpen,
    toggleMenu,
    isLogin,
    setIsLogin,
  }
}
