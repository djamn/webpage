import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {debounceTime} from "rxjs";
import {map} from "rxjs/operators";
import {Project} from "../types/projects.type";

const projectsCollectionName: string = "projects";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private firestore: AngularFirestore) {
  }

  async addProject() {
    try {
      await this.firestore.collection(projectsCollectionName).add({});
    } catch (err) {
      throw err;
    }
  }

  async updateProject(id: string) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).update({});
    } catch (err) {
      throw err;
    }
  }

  getProjects() {
    return this.firestore.collection(projectsCollectionName, ref => ref.orderBy('year_created', 'desc'))
      .snapshotChanges()
      .pipe(
        debounceTime(300), // needed to not load everything twice
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Project
            const id = a.payload.doc.id;
            return {...data, id}
          })
        })
      )
  }

  async deleteProject(id: string) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).delete();
    } catch (err) {
      throw err;
    }
  }

  async likeProject(id: string, currentLikes: number) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).update({
        likes: currentLikes + 1
      })
    } catch (err) {
      throw err;
    }
  }

  async featureProject() {

  }

}
