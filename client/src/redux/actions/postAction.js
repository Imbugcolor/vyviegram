import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData"
import { imageUpload } from "../../utils/imageUpload"
import { createNotify, removeNotify } from "./notifyAction"
import { GLOBALTYPES } from "./globalTypes"

export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST',
    GET_RELATED_POSTS: 'GET_RELATED_POSTS'
}

export const createPost = ({content, images, auth, socket}) => async (dispatch) => {
    let media = []

    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})

        if(images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('posts', { content, images: media }, auth.token, dispatch)
        
        dispatch({
            type: POST_TYPES.CREATE_POST, 
            payload: {...res.data.newPost, user: auth.user }
        })
        
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: false }})
         // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content, 
            image: media[0].url
        }
        dispatch(createNotify({msg, auth, socket}))


    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
}

export const getPosts = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('posts', token, dispatch)

        if (res.data.result === 0) {
            const res1 = await getDataAPI('suggest-posts', token, dispatch)
            dispatch({ 
                type: POST_TYPES.GET_POSTS, 
                payload: {...res1.data, page: 2, total: res1.data.total, suggestion: true} 
            })
        } else {
            dispatch({ 
                type: POST_TYPES.GET_POSTS, 
                payload: {...res.data, page: 2, total: res.data.total} 
            })
        }
        
        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response.data.msg }})
    }
}

export const updatePost = ({content, images, auth, status}) => async (dispatch) => {
    let media = []
    const imgNewUrl = images.filter(img => !img.url)
    const imgOldUrl = images.filter(img => img.url)

    if( status.content === content && 
        imgNewUrl.length === 0 && 
        imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)
        
        const res = await patchDataAPI(`post/${status._id}`, { 
            content, images: [...imgOldUrl, ...media] 
        }, auth.token, dispatch)

        dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost })
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
}

export const likePost = ({post, auth, socket}) => async(dispatch) =>{
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
    socket.emit('likePost', newPost)
    try {
        await patchDataAPI(`post/${post._id}/like`,{}, auth.token, dispatch)
        //Notify 
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }
        dispatch(createNotify({msg, auth, socket}))
    } catch (err) {
        dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg}})
    }
}

export const unlikePost = ({post, auth, socket}) => async(dispatch) =>{
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
    socket.emit('unLikePost', newPost)
    try {
        await patchDataAPI(`post/${post._id}/unlike`,{}, auth.token, dispatch)
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
    } catch (err) {
        dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg}})
    }
}

export const getPost = ({detailPost, relatedPosts, id, auth}) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const postData = await getDataAPI(`post/${id}`, auth.token, dispatch);
            dispatch({ type: POST_TYPES.GET_POST, payload: postData.data.post })

            if(relatedPosts.every(post => post._id !== postData.data.post.user._id)){
                const relatedPostsData = await getDataAPI(`/user_posts/${postData.data.post.user._id}`, auth.token, dispatch)
                dispatch({ type: POST_TYPES.GET_RELATED_POSTS, payload: {...relatedPostsData.data, _id: postData.data.post.user._id} })
            }
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deletePost = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token, dispatch)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const deletePostByAdmin = ({message, post, auth, socket, navigate}) => async (dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})

        const res = await deleteDataAPI(`admin/post/${post._id}`, auth.token, dispatch)

        const msgDelete = {
            id: post._id,
            text: 'Your post has been deleted',
            description:  message.msg,
            recipients: [post.user._id],
            url: `/post/removed/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg: msgDelete, auth, socket}))

        // Remove Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`
        }

        await dispatch(removeNotify({msg, auth, socket}))

        dispatch({type: POST_TYPES.DELETE_POST, payload: post})

        dispatch({type: GLOBALTYPES.ADMIN_DELETE_POST, payload: null})

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: 'Deleted Post.' }})

        navigate('/')

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, {}, auth.token, dispatch)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, {}, auth.token, dispatch)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const reportPost = ({message, post, auth, socket}) => async (dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})

        const res = await postDataAPI(`/report/post/${post._id}`, { text: message.msg }, auth.token, dispatch)

        socket.emit('createReport', res.data.report)

        dispatch({type: GLOBALTYPES.REPORT_POST, payload: null})

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: 'Reported.' }})

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}
