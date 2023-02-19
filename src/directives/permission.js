
export default{
    inserted(el, bindings, vnode) {
        let btnPermissionValue = bindings.value;
        let boolean =vnode.context.$store.state.buttomPermission.buttomPermission[btnPermissionValue];
        !boolean && el.parentNode.removeChild(el);
    }
}