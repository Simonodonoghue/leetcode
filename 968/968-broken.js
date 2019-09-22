/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */

// automated unit test creation
// improving efficiency (remove if blocks and &&, logging, assigning variables that aren't used (sonarqube is good!))

var cameraCount = 0

exports.minCameraCover = function(root) {
    cameraCount = 0
        
    
    recurseNode(root)
        
    return cameraCount;
};

function recurseNode(node, canBeCovered) {
    
    var leftResp = node.left && recurseNode(node.left, true)
    var rightResp = node.right && recurseNode(node.right, true)
    
    if ((leftResp != null && !leftResp.hasCamera && !leftResp.isCovered) || (rightResp != null && !rightResp.hasCamera && !rightResp.isCovered)) {
        cameraCount++
        return {
            hasCamera: true,
            isCovered: false
        }
    }
    
      if (((leftResp != null && !leftResp.hasCamera && leftResp.isCovered && (rightResp == null || rightResp && !rightResp.hasCamera)) || 
           (rightResp != null && !rightResp.hasCamera && rightResp.isCovered && (leftResp == null || leftResp && !leftResp.hasCamera)))
           && !canBeCovered) {
        cameraCount++
        return {
            hasCamera: true,
            isCovered: false
        }
    }
    
    if ((leftResp && leftResp.hasCamera) || (rightResp && rightResp.hasCamera)) {
        return {
            hasCamera: false,
            isCovered: true
        }
    } 
    
    return {
        hasCamera: false,
        isCovered: false
    }
   
}